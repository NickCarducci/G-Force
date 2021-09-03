const http = require("http");
const path = require("path");
const fs = require("fs");

const locs = require("mastercard-locations");
const places = require("mastercard-places");
//https://codesandbox.io/embed/6ez2t?codemirror=1

var rs = null; //readStream
var req = null;
//unmount node process without exiting before aborting request||unpipe stream
process
  .on("unhandledRejection", (reason, p) => {
    console.error(
      "VAUMONEY:PROCESS",
      reason,
      "Unhandled Rejection at Promise",
      p
    );
  })
  .on("uncaughtException", (err) => {
    console.error("VAUMONEY:PROCESS", err, "Uncaught Exception thrown");
    //process.exit(1);
    req.abort();
    rs.unpipe();
    throw new Error(err.message);
  });

var iMCard = null,
  mc = null;
const initializeMCard = () => {
  if (!iMCard) {
    console.log("VAUMONEY:APP: initializing mastercard api");
    mc = locs.MasterCardAPI;
    iMCard = true;
    mc.init({
      sandbox: process.env.NODE_ENV !== "production",
      authentication: new mc.OAuth(
        process.env.MASTERCARD_CONSUMER_KEY,
        Buffer.from(process.env.MASTERCARD_P12_BINARY, "base64"),
        "keyalias",
        "keystorepassword"
      )
    });
  }
};
const RFS = (filePath) => fs.readFileSync(filePath, "utf-8");
//fs.createReadStream(path).pipe = (res) => res.write(this)
//const CRS = (rs) => fs.createReadStream(rs);
const mastercardRoute = async (req, func) => {
  const cb = (error, data) => RFS(error ? error : data, "utf-8"); // CRS(error ? error : data);
  initializeMCard();
  let rs = null;
  if (func === "getAtms") {
    const {
      PageLength, //"5"
      PostalCode, //"11101"
      PageOffset //"0"
    } = req.query;
    rs = await locs.ATMLocations.query(
      {
        PageLength,
        PostalCode,
        PageOffset
      },
      cb
    );
  } else if (func === "getMerchants") {
    const { countryCode, latitude, longitude, distance } = req.query;
    const q = {
      pageOffset: 0,
      pageLength: 10,
      radiusSearch: "true",
      unit: "km",
      distance,
      place: {
        countryCode,
        latitude,
        longitude
      }
    };
    rs = await places.MerchantPointOfInterest.create(q, cb);
  } else if (func === "getNames") {
    rs = await places.MerchantCategoryCodes.query({}, cb);
  } else if (func === "getTypes") {
    rs = await places.MerchantIndustries.query({}, cb);
  }
  return rs && rs;
};
//headers
console.log("VAUMONEY:SERVER: CALLING SERVER");
const appHead = {
  "Content-Type": "application/javascript; charset=utf-8",
  "Cache-Control": "public, max-age=300"
};
//const errHead = { "Content-Type": "text/plain" };
const dataHead = {
  "Content-Type": "application/json"
};
const routeOrChunk = async (reqq, res) => {
  req = { ...reqq };
  console.log("VAUMONEY:SERVER: CREATED SERVER");
  /*if (req.url !== "/" || res.statusCode === 404) {
    res.statusCode = 404;
    rs = CRS(`${req.method + " " + req.url}, 404: File Not Found`);
    res.writeHead(res.statusCode, errHead);
    //res.end(`${req.method + " " + req.url}, 404: File Not Found`);
  } else */ if (
    ["/deposit", "/merchant_names", "/merchant_types", "/merchants"].includes(
      req.url
    ) &&
    req.method === "GET"
  ) {
    res.writeHead(200, dataHead);
    if (req.url === "/deposit") {
      rs = await mastercardRoute(req, "getAtms");
    } else if (req.url === "/merchant_names") {
      rs = await mastercardRoute(req, "getNames");
    } else if (req.url === "/merchant_types") {
      rs = await mastercardRoute(req, "getTypes");
    } else if (req.url === "/merchants") {
      rs = await mastercardRoute(req, "getMerchants");
    }
  } else {
    const filePath = path.resolve(__dirname, "..", "..", "..", "public");
    //rs = CRS(filePath);
    var stat = fs.statSync(filePath);
    console.log("sending file, size %d", stat.size);

    res.writeHead(200, {
      ...appHead,
      "Content-Type": "application/x-tar",
      "Content-Disposition": "attachment; filename=" + filePath,
      "Content-Length": stat.size
    });
    const body = RFS(filePath);
    res.write(body);
    res.end();
  }
  console.log("VAUMONEY:SERVER: " + res.statusCode);
  /*if (rs) {
    let chunks = [];
    rs
      //.on("data", (chunk) => console.log(`VAUMONEY:READSTREAM`, chunk))
      // 'readable' may be triggered multiple times as new data received as buffer
      .on("readable", () => {
        const chunk = rs.read();
        console.log("VAUMONEY:READSTREAM: new data received in buffer");
        // Use a loop to make sure we read all currently available data
        if (chunk) {
          chunks.push(chunk);
          console.log(`Read ${chunk.length} bytes of data...`);
          //rs.pipe(res).on("finish", () => {
            console.log("VAUMONEY:PIPE: piped all data", res);
            //res.end();
            //rs.unpipe();
          });
        }
      })
      .on("end", () => {
        var body = Buffer.concat(chunks);
        console.log("VAUMONEY:READSTREAM: no more buffered data:**: ", body);
        //res.write(body);
        res.end(body);
      })
      .on("close", (err) => {
        console.log(
          "VAUMONEY:READSTREAM: Stream has been Closed" + err
            ? ` due to an error ${err.message}`
            : ""
        );
      });
  }*/
};
//server
const server = http.createServer();
server.on("error", (e) => console.log(e.message));
server.on("request", routeOrChunk);
server.listen(8080);

//const path = require("path");

const targets = { node: "current" }; //"web"

const presets = [
  [
    "@babel/preset-env",
    {
      //include: "src/index.js", //path.resolve(__dirname, "./src", "index.js"),
      //åexclude: /(node_modules)/,
      targets
    }
  ],
  "@babel/preset-react"
];

module.exports = (api) => {
  api.cache(true);
  return {
    presets,
    plugins: [
      /*"external-helpers"*/
    ]
  };
};

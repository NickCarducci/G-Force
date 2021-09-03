const path = require("path");
//const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
//const nodeExternals = require('webpack-node-externals');
const pkg = require("./package.json");

const target = "web"; //{ node: "current" }

const env = [
  "@babel/preset-env",
  {
    target
  }
];
//unlike object, array prints without requiring a field
const pluginsArray = {
  plugins: [
    [
      "@babel/plugin-proposal-class-properties",
      {
        include: path.resolve(__dirname, "./src", "index.js"),
        exclude: /(node_modules)/
      }
    ]
  ]
};
const babelRules = {
  test: /\.(jsx|js)$/,
  exclude: /(node_modules)/,
  use: {
    loader: "babel-loader",
    options: {
      presets: [env, "@babel/preset-react", pluginsArray]
    }
  }
};
const transpiler = {
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./dist"),
      filename: "bundle.js",
      hash: true,
      inject: "body"
    }) /*,
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    })*/
  ],
  module: {
    rules: [babelRules]
  },
  performance: {
    maxEntrypointSize: 750000,
    maxAssetSize: 750000
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  }
};
module.exports = {
  target,
  devtool: false,
  mode: "development", //"production"
  entry: {
    [pkg.name]: path.resolve(__dirname, "./src", "index.js")
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "bundle.js"
  },
  resolve: {
    extensions: ["*", ".js"],
    modules: ["node_modules"],
    alias: {
      react: path.resolve(__dirname, "./node_modules", "react"),
      "react-dom": path.resolve(__dirname, "./node_modules", "react-dom")
    }
  },
  externals: {
    react: {
      commonjs: "react",
      commonjs2: "react",
      amd: "React",
      root: "React"
    },
    "react-dom": {
      commonjs: "react-dom",
      commonjs2: "react-dom",
      amd: "ReactDOM",
      root: "ReactDOM"
    }
  },
  ...transpiler
};

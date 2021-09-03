import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import autoExternal from "rollup-plugin-auto-external";
import nodeResolve from "@rollup/plugin-node-resolve";
//import livereload from "rollup-plugin-livereload";
import postcss from "rollup-plugin-postcss";

const targets = { node: "current" }; //"web"

const presets = [
  [
    "@babel/preset-env",
    {
      //include: "src/index.js", //path.resolve(__dirname, "./src", "index.js"),
      //exclude: /(node_modules)/,
      targets
    }
  ],
  "@babel/preset-react"
];

export default {
  input: "src/index.js",
  output: {
    file: "scripts.js",
    format: "iife",
    sourcemap: true,
    banner: `import { ${[
      "React",
      "ReactDOM",
      "reactRouterDom",
      "reactTransitionGroup"
    ] //Object.keys(React)
      .map((key) => key)
      .join(", ")} } from "react";`
  },
  plugins: [
    autoExternal(),
    nodeResolve({
      only: [/^\.{0,2}\//],
      extensions: [".js"],
      mainFields: ["module", "main"]
    }),
    commonjs({
      include: ["node_modules/**"],
      exclude: ["node_modules/process-es6/**"]
    }),
    postcss({
      type: ".css",
      extract: true
    }),
    babel({
      babelHelpers: "bundled",
      presets,
      exclude: "node_modules/**" // only transpile our source code
    })
    //livereload()
  ]
};

import resolve from "rollup-plugin-node-resolve";
import iife from "rollup-plugin-iife";
import {terser} from "rollup-plugin-terser";
import inline from "rollup-plugin-inline-js";
import buble from "@rollup/plugin-buble";

export default [
  base({
    external: ["jsx-dom"],
    output: {
      dir: "dist/module",
      entryFileNames: "[name].mjs"
    }
  }),
  base({
    output: {
      dir: "dist/browser"
    },
    plugins: [
      iife(),
      terser({
        module: false
      })
    ]
  })
];

function base({output, plugins = [], ...args}) {
  return {
    input: {
      "webext-dialog": "src/index.mjs",
      "webext-dialog-popup": "src/popup.mjs"
    },
    output: {
      format: "es",
      sourcemap: true,
      ...output
    },
    plugins: [
      inline(),
      resolve(),
      buble({
        target: {
          firefox: "64"
        }
        // transforms: {
          // asyncAwait: false,
          // forOf: false
        // },
        // objectAssign: "Object.assign"
      }),
      ...plugins
    ],
    ...args
  };
}

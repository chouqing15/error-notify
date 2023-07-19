import { babel } from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import dts from "rollup-plugin-dts";
import typescript from "@rollup/plugin-typescript";
import { readFileSync } from "fs";

const pkg = JSON.parse(readFileSync("package.json", { encoding: "utf8" }));

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: pkg.main,
        format: "es",
      },
      {
        file: pkg.umd,
        name: "errorMonitoring",
        format: "umd",
      },
    ],
    plugins: [typescript(), babel({ babelHelpers: "bundled" }), terser()],
  },
  {
    input: "src/index.ts",
    output: {
      file: pkg.types,
      format: "es",
    },
    plugins: [dts()],
  },
];

import { Config } from '@stencil/core';
import { postcss } from "@stencil/postcss";
import tailwindcss from 'tailwindcss';
import autoprefixer from "autoprefixer";
import purgecss from '@fullhuman/postcss-purgecss';
const atImport = require("postcss-import")
import replace from "postcss-replace"

// https://stenciljs.com/docs/config

const purge = purgecss({
  content: ["./src/**/*.tsx", "./src/index.html"],
  safelist: [':host'],
  defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
});

export const config: Config = {
  globalScript: 'src/global/app.ts',
  globalStyle: 'src/global/app.css',
  taskQueue: 'async',
  outputTargets: [{
    type: 'www',
    serviceWorker: null
  }],
  plugins: [
    postcss({
      plugins: [
        atImport({ path: ["src"] }),
        tailwindcss("./tailwind.config.js"),
        autoprefixer(),
        replace({ pattern: 'html', data: { replaceAll: ':host' } }),
        ...(process.env.NODE_ENV === "production" ? [purge, cssnano()] : [])
      ]
    })
  ],
  devServer: {
    reloadStrategy: 'pageReload'
  }

};

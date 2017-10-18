import { readFileSync } from 'fs';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';
import filesize from 'rollup-plugin-filesize';
import uglify from 'rollup-plugin-uglify';
import progress from 'rollup-plugin-progress';
import replace from 'rollup-plugin-replace';
import image from 'rollup-plugin-img';
import html from 'rollup-plugin-fill-html';
import postcss from 'rollup-plugin-postcss';
import clean from 'rollup-plugin-clean';
import eslint from 'rollup-plugin-eslint';
import json from 'rollup-plugin-json';
import nodeBuiltins from 'rollup-plugin-node-builtins';
import globals from "rollup-plugin-node-globals";
import sass from 'node-sass';
import cssnano from 'cssnano';
import postcssModules from 'postcss-modules';
import px2rem from 'postcss-px2rem';
import autoprefixer from 'autoprefixer';

const isProd = process.env.NODE_ENV === 'production';
const distPath = isProd ? 'dist' : 'static';
const cssExportMap = {};
const plugins =  [
  eslint({
    // throwOnError: true,
    exclude: ['node_modules/**', '**.scss']
  }),
  resolve({
    preferBuiltins: true
  }), // for support external module in node_modules
  commonjs({ // for support not es2015 module
    namedExports: {
      'node_modules/react/react.js': [ 'Component', 'PureComponent', 'Children', 'createElement' ],
      'node_modules/react-dom/index.js': [ 'findDOMNode' ]
    }
  }),
  filesize(), // show the filesize in cli
  progress(), // show the progress of build
  replace({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development') // for react
  }),
  postcss({
    plugins: [
      postcssModules({
        getJSON(id, exportTokens) {
          cssExportMap[id] = exportTokens;
        }
      }),
      px2rem({ remPrecision: 2 }), // must after postcssModules
      autoprefixer({
        remove: false
      }),
      cssnano() // Minimize css
    ],
    getExport (id) {
      return cssExportMap[id];
    },
    sourceMap: true, // default false, only make sense when extract to file
    extract: `${distPath}/bundle-[hash].css`, // default false
    preprocessor: (content, id) => ({ code: sass.renderSync({ data: content }).css.toString() }),
    extensions: ['.css', '.scss']  // default value
    // parser: sugarss
  }), // must before babel
  clean(),
  image({
    hash: true,
    output: `${distPath}/images`,
    exclude: 'node_modules/**'
  }),
  json(),
  babel(),
  nodeBuiltins(), // to include Node builtins, some modules may depand on global
  globals(), // to include Node globals
  html({
    template: 'src/index.html',
    filename: 'index.html',
    externals: [
      { type: 'js', file: beaconjs, pos: 'before' },
      { type: 'js', file: hybridjs, pos: 'before' },
      { type: 'js', file: guoguojs, pos: 'before' }
    ]
  })
];

if (isProd) {
  plugins.push(uglify({
    compress: {
      sequences: true,
      dead_code: true,
      conditionals: true,
      booleans: true,
      unused: true,
      if_return: true,
      join_vars: true,
      drop_console: true,
			drop_debugger: true,
			warnings: false,
			loops: true,
			properties: true
    },
    mangle: {
      except: [ 'exports', 'require' ]
    },
    output: {
      comments: false
    }
  }));
} else {
  plugins.push(serve({
    // Launch in browser (default: false)
    open: true,
    // Show server address in console (default: true)
    verbose: false,
    // Folder to serve files from
    contentBase: distPath,
    // Set to true to return index.html instead of 404
    historyApiFallback: false,
    port: 8080
  }));
}

export default {
  input: 'src/container/index.js',
  output: {
    file: `${distPath}/bundle-[hash].js`,
    format: 'iife',
    name: 'iife-bundle',
    sourceMap: !isProd,
  },
  plugins
};

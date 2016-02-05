/**
 * Created by Yangwook Ryoo on 2/1/16.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
export const lintConfig = {
  extends: 'eslint:recommended',
  ecmaFeatures: {
    'modules': true,
    "jsx": true
  },
  "env": {
    "es6": true,
    "node": true,
    "commonjs": true,
    "browser": true
  },
  "rules": {
    "no-unused-vars": 1
  }
};
export const browserifyAppConfig = {
  entries: 'src/app.jsx',
  extensions: ['.js', 'jsx']
  //TODO update location, remove debug for production
  //MUST EXCLUDE server.js and db.js
};
export const browserifyServerConfig = {
  entries: 'src/server.js',
  extensions: ['.js'],
  cache: {},
  packageCache: {},
  fullPaths: false,
  debug: true,
  builtins: false,
  commondir: false,
  bundleExternal: true,
  basedir: undefined,
  browserField: false,
  detectGlobals: true,
  insertGlobals: false,
  insertGlobalVars:
  { process: undefined,
    global: undefined,
    'Buffer.isBuffer': undefined,
    Buffer: undefined },
  ignoreMissing: false,
  standalone: undefined   //this is --node option
  //TODO update location
  //TODO fix unnecessary options
};


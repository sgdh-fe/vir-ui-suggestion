const {
  name,
  version
} = require('./package.json')

const banner = `
/*!
 * ${name} v${version}
 * (c) ${new Date().getFullYear()} cjg
 * Released under the MIT License.
 */
`

import babel from 'rollup-plugin-babel'

export default {
  entry: 'src/index.js',
  dest: 'dist/index.js',
  format: 'umd',
  moduleName: 'VirUiSuggestion',
  sourceMap: true,
  external: ['jquery', 'vir'],
  globals: {
    jquery: 'jQuery',
    vir: 'Vir'
  },
  plugins: [
    babel()
  ],
  banner
}
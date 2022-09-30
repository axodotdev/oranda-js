const toCss = require('to-css')
const path = require('path')
const tailwindcss = require('tailwindcss')
const CleanCSS = require('clean-css')
const sass = require('node-sass')
const { readOptions } = require('../readOptions')
const { default: postcss } = require('postcss')

const transformCSS = async ({ filesystem, distFolder, scssPath }) => {
  const { options } = readOptions({ filesystem })

  // Get CSS defined by the user
  const getAdditionalStyles = () => {
    // if string read the file path
    if (typeof options.styles === 'string') {
      return filesystem.read(`${process.cwd()}/${options.styles}`)
    }

    // If not read object and turn into css
    return toCss(options.styles, {
      selector: (s) => `#oranda ${s}`,
      property: (p) =>
        p.replace(/([A-Z])/g, (matches) => `-${matches[0].toLowerCase()}`),
    })
  }

  // Transform sass to css
  const css = sass
    .renderSync({
      data: [
        filesystem.read(path.join(scssPath, 'style.scss')),
        getAdditionalStyles(),
      ].join(''),
      includePaths: [scssPath],
    })
    .css.toString()

  const postcssOutput = (await postcss([tailwindcss({})]).process(css)).css

  // minify css
  const minifiedCSS = new CleanCSS().minify(postcssOutput).styles

  // write the css
  await filesystem.write(`${distFolder}/style.css`, minifiedCSS)
}

module.exports = { transformCSS }

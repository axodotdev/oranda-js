const toCss = require('to-css')
const path = require('path')
const CleanCSS = require('clean-css')
const sass = require('node-sass')
const getRemoteStyles = require('../remoteStyles')
const { readOptions } = require('../readOptions')

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

  // Get normalize and google fonts
  const remoteStyles = await getRemoteStyles()
  // Transform sass to css
  const css = sass
    .renderSync({
      data: [
        remoteStyles,
        getAdditionalStyles(),
        filesystem.read(path.join(scssPath, 'style.scss')),
      ].join(''),
      includePaths: [scssPath],
    })
    .css.toString()

  // minify css
  const minifiedCSS = new CleanCSS().minify(css).styles

  // write the css
  await filesystem.write(`${distFolder}/style.css`, minifiedCSS)
}

module.exports = { transformCSS }

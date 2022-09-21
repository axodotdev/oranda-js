const DEFAULT_FILENAMES = require('./constants/DEFAULT_FILENAMES')

const capitalize = (name) =>
  name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()

module.exports = ({ logo, pathPrefix, name, noHeader, additionalFiles }) => {
  const fileName = (file) => {
    const isIndex = DEFAULT_FILENAMES.includes(file)
    return isIndex
      ? 'Home'
      : (file.split('/')[file.split('/').length - 1] || '').split('.md')[0]
  }

  const absolutePath = (path) => `${pathPrefix}${path}`

  const fileHref = (file) =>
    fileName(file) === 'Home' ? '' : `${fileName(file).toLowerCase()}.html`

  return !noHeader
    ? `<header>${name ? `<h1>${name}</h1>` : ''}${
        logo !== ''
          ? `<img class="logo" src="${absolutePath(
              logo
            )}" alt="${name} logo" />`
          : ''
      }
      ${
        additionalFiles.length > 1
          ? `<nav><ul>${additionalFiles
              .map(
                (page) =>
                  `<li><a href="${absolutePath(fileHref(page))}">${capitalize(
                    fileName(page)
                  )}</a></li>`
              )
              .join('')}</ul></nav>`
          : ''
      }
      </header>`
    : ''
}

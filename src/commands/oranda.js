const toCss = require('to-css')
const path = require('path')
const CleanCSS = require('clean-css')
const imageminJpegtran = require('imagemin-jpegtran')
const imageminPngquant = require('imagemin-pngquant')
const sass = require('node-sass')
const createHTML = require('create-html')
const corner = require('../utils/githubCorner')
const orandaImports = require('../utils/orandaImports')
const head = require('../utils/head')
const header = require('../utils/header')
const DEFAULT_FILENAMES = require('../utils/constants/DEFAULT_FILENAMES')
const getRemoteStyles = require('../utils/remoteStyles')
const snarkdown = require('snarkdown')
const iterator = require('markdown-it-for-inline')
const THEMES = require('../utils/syntaxHighlightThemes')
const { MESSAGES } = require('../utils/constants/messages')
const { readOptions, defaultOptions } = require('../utils/readOptions')
const { detectOS } = require('../utils/getOs')
const { createTabs } = require('../utils/createTabs')

const md = require('markdown-it')({
  html: true,
  xhtmlOut: true,
  linkify: true,
})

md.use(require('markdown-it-inline-comments'))
md.use(require('markdown-it-checkbox'))
md.use(require('markdown-it-github-headings'))
md.use(require('markdown-it-anchor'), {
  level: 1,
})
md.use(require('markdown-it-emoji'))

md.linkify.tlds('.md', false)
md.linkify.tlds('.MD', false)
md.use(iterator, 'url_new_win', 'link_open', function (tokens, idx) {
  const aIndex = tokens[idx].attrIndex('target')
  const hrefIndex = tokens[idx].attrIndex('href')

  if (tokens[idx].attrs[hrefIndex][1].startsWith('#')) return

  if (aIndex < 0) {
    tokens[idx].attrPush(['target', '_blank'])
  } else {
    tokens[idx].attrs[aIndex][1] = '_blank'
  }
})
const defaultRender =
  md.renderer.rules.html_block ||
  function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options)
  }

md.renderer.rules.html_block = function (tokens, idx, options, env, self) {
  const htmlBlock = tokens[idx]
  tokens[idx].content = snarkdown(htmlBlock.content)

  return defaultRender(tokens, idx, options, env, self)
}

module.exports = {
  name: 'oranda',
  description: 'Build your static website from markdown',
  run: async (toolbox) => {
    const {
      print: { info, success, error },
      filesystem,
    } = toolbox

    const { options, packageJSON } = readOptions({ filesystem })

    const darkThemeExists = THEMES.includes(options.syntaxHighlight.dark)
    const lightThemeExists = THEMES.includes(options.syntaxHighlight.light)

    md.use(require('markdown-it-shiki').default, {
      theme: {
        dark: darkThemeExists
          ? options.syntaxHighlight.dark
          : defaultOptions.syntaxHighlight.dark,
        light: lightThemeExists
          ? options.syntaxHighlight.light
          : defaultOptions.syntaxHighlight.light,
      },
    })

    const dist = options.dist
    const distFolder = `${process.cwd()}/${dist}`

    // CSS

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
        data: remoteStyles
          .concat(filesystem.read(path.join(__dirname, 'css/style.scss')))
          .concat(getAdditionalStyles()),
        includePaths: [path.join(__dirname, 'css')],
      })
      .css.toString()

    // minify css
    const minifiedCSS = new CleanCSS().minify(css).styles

    // write the css
    await filesystem.write(`${distFolder}/style.css`, minifiedCSS)

    // HTML

    // Add trailing slash if missing
    options.pathPrefix = options.pathPrefix.replace(/\/?$/, '/')

    // Check for `options.file`, if null, check if a default file exists, or error
    if (options.file === null) {
      options.additionalFiles.unshift(
        DEFAULT_FILENAMES.find((filename) => {
          return filesystem.exists(filename) ? filename : null
        })
      )
      // Throw error if no default file could be found
      if (
        options.additionalFiles[options.additionalFiles.length - 1] === null
      ) {
        return error(MESSAGES.no_file_found)
      }
    } else {
      // Set file to the given `options.file` value
      options.additionalFiles.unshift(options.file)
    }

    // Map through all files
    options.additionalFiles.map(async (file) => {
      // Get markdown contents of given file
      const markdown = filesystem.read(`${process.cwd()}/${file}`)

      // Throw error if file does not exist and subsequently can't get markdown from the file.
      if (typeof markdown === 'undefined') {
        return error(MESSAGES.additional_file_not_found(file))
      }

      const description = options.description || packageJSON.description
      const name = options.name || packageJSON.name
      const repo = options.repo || (packageJSON.repository || {}).url
      const githubCorner = repo ? corner(repo, options.darkTheme) : ''
      const dark = options.darkTheme ? 'dark' : 'light'

      // Get all images that are not from the internet ™️
      const images = (
        markdown.match(/(?:!\[(.*?)\]\((?!http)(.*?)\))/gim) || []
      )
        .filter((i) => !i.includes('https'))
        .map((image) => (image.split('./')[1] || '').split(')')[0])

      // Map through them and if that file exists minify it and copy it
      images.map(async (i) => {
        const imagemin = (await import('imagemin')).default
        if (filesystem.exists(`${process.cwd()}/${i}`)) {
          await imagemin([`${process.cwd()}/${i}`], {
            destination: `${distFolder}/${i.substring(0, i.lastIndexOf('/'))}/`,
            plugins: [
              imageminJpegtran(),
              imageminPngquant({ quality: [0.65, 0.8] }),
            ],
          })
        }
      })

      // Copy favicon
      if (!options.favicon.includes('http') && options.favicon !== '') {
        filesystem.copy(
          `${process.cwd()}/${options.favicon}`,
          `${distFolder}/${options.favicon}`,
          { overwrite: true }
        )
      }

      // Copy logo
      if (!options.logo.includes('http') && options.logo !== '') {
        filesystem.copy(
          `${process.cwd()}/${options.logo}`,
          `${distFolder}/${options.logo}`,
          { overwrite: true }
        )
      }

      // Copy shareCard
      if (!options.shareCard.includes('http') && options.shareCard !== '') {
        filesystem.copy(
          `${process.cwd()}/${options.shareCard}`,
          `${distFolder}/${options.shareCard}`,
          { overwrite: true }
        )
      }

      const isIndex = DEFAULT_FILENAMES.includes(file)

      const fileName = isIndex
        ? 'index'
        : (file.substring(file.lastIndexOf('/') + 1) || '').split('.md')[0]

      const title = name ? name.charAt(0).toUpperCase() + name.slice(1) : ''
      const html = createHTML({
        title,
        css: orandaImports.css,
        lang: 'en',
        head: head(
          description,
          name,
          options,
          options.homepage || packageJSON.homepage,
          options.meta,
          options.remoteStyles,
          options.remoteScripts
        ),
        body: /*html*/ `<div id="oranda"><div class="body ${dark}"><div class="container">${githubCorner}${header(
          options,
          name,
          options.additionalFiles
        )}${createTabs({ options, packageJSON })}${md.render(
          markdown
        )}</div></div><script>${detectOS}</script></div>`,
        favicon: options.favicon,
      })

      try {
        await filesystem.write(
          `${distFolder}/${fileName.toLowerCase()}.html`,
          html
        )
      } catch (e) {
        error(MESSAGES.creation_error, file)
      }
    })

    info(MESSAGES.file_generated(dist))
    success(MESSAGES.ready_to_deploy(dist))
  },
}

exports.DEFAULT_FILENAMES = DEFAULT_FILENAMES

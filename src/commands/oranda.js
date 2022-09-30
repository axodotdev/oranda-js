const createHTML = require('create-html')
const corner = require('../utils/githubCorner')
const orandaImports = require('../utils/orandaImports')
const head = require('../utils/head')
const header = require('../utils/header')
const DEFAULT_FILENAMES = require('../utils/constants/DEFAULT_FILENAMES')
const path = require('path')
const { MESSAGES } = require('../utils/constants/messages')
const { readOptions } = require('../utils/readOptions')
const { detectOS } = require('../utils/getOs')
const { createTabs } = require('../utils/createTabs')
const { setUpMarkdownParser } = require('../utils/setMdParser')
const { copyAssets } = require('../utils/steps/copy')
const { imageManipulation } = require('../utils/steps/images')
const { transformCSS } = require('../utils/steps/css')

module.exports = {
  name: 'oranda',
  description: 'Build your static website from markdown',
  run: async (toolbox) => {
    const {
      print: { info, success, error },
      filesystem,
    } = toolbox

    const { options } = readOptions({ filesystem })

    const scssPath = path.join(__dirname, 'css')
    const md = setUpMarkdownParser({ filesystem })

    const dist = options.dist
    const distFolder = `${process.cwd()}/${dist}`

    await transformCSS({ filesystem, distFolder, scssPath })

    // HTML

    // Add trailing slash if missing
    options.pathPrefix = options.pathPrefix.replace(/\/?$/, '/')

    // Check for `options.file`, if null, check if a default file exists, or error
    if (options.file === null) {
      options.additionalFiles.unshift(
        DEFAULT_FILENAMES.find((filename) =>
          filesystem.exists(filename) ? filename : null
        )
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

      const repo = options.repository
      const githubCorner = repo ? corner(repo, options.theme !== 'light') : ''

      imageManipulation({ filesystem, distFolder, markdown })

      copyAssets({ filesystem, distFolder })

      const tabs = await createTabs({ options, filesystem })

      const fileName = DEFAULT_FILENAMES.includes(file)
        ? 'index'
        : (file.substring(file.lastIndexOf('/') + 1) || '').split('.md')[0]

      const name = options.name
      const title = name ? name.charAt(0).toUpperCase() + name.slice(1) : ''

      const html = createHTML({
        title,
        css: orandaImports.css,
        lang: 'en',
        head: head(options),
        body: /*html*/ `<div id="oranda"><div class="body ${
          options.theme
        }"><div class="container">${githubCorner}${header(
          options
        )}${tabs}${md.render(markdown)}</div></div>${
          options.downloads ? `<script>${detectOS}</script>` : ''
        }</div>`,
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

const markdownlint = require('markdownlint')
const { MESSAGES } = require('../utils/constants/messages')
const DEFAULT_FILENAMES = require('../utils/constants/DEFAULT_FILENAMES')

module.exports = {
  name: 'lint',
  alias: 'l',
  description: 'Lint your linked markdown files',
  run: async (toolbox) => {
    const {
      print: { success, error },
      filesystem,
    } = toolbox

    const packageJSON =
      filesystem.read(`${process.cwd()}/package.json`, 'json') || {}

    const options = {
      ...(packageJSON.oranda || {}),
      ...(filesystem.read(`${process.cwd()}/.oranda.config.json`, 'json') ||
        {}),
    }
    const files = []

    DEFAULT_FILENAMES.find((filename) => {
      return filesystem.exists(filename) ? files.push(filename) : null
    })

    if (options.additionalFiles) {
      files.push(options.additionalFiles)
    }

    markdownlint({ files }, (err, result) => {
      if (!err) {
        if (result.toString()) {
          error(MESSAGES.lint_errors)
          error(result.toString())
        } else {
          success(MESSAGES.lint_success)
        }
      }
    })
  },
}

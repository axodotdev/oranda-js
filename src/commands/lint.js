const markdownlint = require('markdownlint')
const { MESSAGES } = require('../utils/constants/messages')
const DEFAULT_FILENAMES = require('../utils/constants/DEFAULT_FILENAMES')
const { readOptions } = require('../utils/readOptions')

module.exports = {
  name: 'lint',
  alias: 'l',
  description: 'Lint your linked markdown files',
  run: async (toolbox) => {
    const {
      print: { success, error },
      filesystem,
    } = toolbox

    const { options } = readOptions({ filesystem })
    const files = []

    DEFAULT_FILENAMES.find((filename) =>
      filesystem.exists(filename) ? files.push(filename) : null
    )

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

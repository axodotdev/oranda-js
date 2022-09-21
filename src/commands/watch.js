const DEFAULT_FILENAMES = require('../utils/constants/DEFAULT_FILENAMES')
const fs = require('fs')
const { run } = require('./oranda')
const { MESSAGES } = require('../utils/constants/messages')
const { readOptions } = require('../utils/readOptions')

module.exports = {
  name: 'watch',
  alias: 'w',
  description: 'Watch your markdown files for changes and build automatically',
  run: async (toolbox) => {
    const {
      print: { success },
      filesystem,
    } = toolbox
    success(MESSAGES.watching_files)

    const { options } = readOptions({ filesystem })
    const files = []

    DEFAULT_FILENAMES.find((filename) =>
      filesystem.exists(filename) ? files.push(filename) : null
    )

    if (options.additionalFiles) {
      files.push(...options.additionalFiles)
    }

    files.map((file) => {
      fs.watch(file, (e, filename) => {
        if (filename && e === 'change') {
          success(`${filename} changed. Building`)
          run(toolbox)
        }
      })

      return null
    })
  },
}

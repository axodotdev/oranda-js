const { readOptions } = require('../readOptions')

const copyAssets = ({ filesystem, distFolder }) => {
  const { options } = readOptions({ filesystem })
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
}

module.exports = { copyAssets }

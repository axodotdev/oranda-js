const defaultOptions = {
  dist: 'public',
  darkTheme: false,
  noHeader: false,
  file: null,
  name: null,
  description: null,
  styles: {},
  logo: '',
  shareCard: '',
  favicon: '',
  additionalFiles: [],
  homepage: null,
  repo: null,
  pathPrefix: `${process.env.PATH_PREFIX || ''}`,
  meta: [],
  remoteStyles: [],
  remoteScripts: [],
  syntaxHighlight: {
    dark: 'poimandres',
    light: 'github-light',
  },
}

const readOptions = ({ filesystem }) => {
  const packageJSON =
    filesystem.read(`${process.cwd()}/package.json`, 'json') || {}

  const options = {
    ...defaultOptions,
    ...(packageJSON.oranda || {}),
    ...(filesystem.read(`${process.cwd()}/.oranda.config.json`, 'json') || {}),
  }

  return { options, packageJSON }
}

module.exports = { readOptions, defaultOptions }

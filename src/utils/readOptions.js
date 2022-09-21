const toml = require('toml')

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
  const { oranda, version, name, description, repository, homepage } =
    filesystem.read(`${process.cwd()}/package.json`, 'json') || {}

  let cargo = {}

  try {
    cargo = toml.parse(
      filesystem.read(`${process.cwd()}/cargo.toml`, 'utf8')
    ).package
  } catch {}

  console.log(cargo)

  const options = {
    version,
    name,
    description,
    homepage,
    repository: repository?.url,
    ...defaultOptions,
    ...(oranda || {}),
    ...cargo,
    ...(filesystem.read(`${process.cwd()}/.oranda.config.json`, 'json') || {}),
  }

  return { options }
}

module.exports = { readOptions, defaultOptions }

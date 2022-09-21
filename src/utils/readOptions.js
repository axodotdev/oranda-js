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

const camelize = (s) => s.replace(/-./g, (x) => x[1].toUpperCase())

const readOptions = ({ filesystem }) => {
  const {
    oranda = {},
    version,
    name,
    description,
    repository,
    homepage,
  } = filesystem.read(`${process.cwd()}/package.json`, 'json') || {}

  let cargo = {}

  try {
    cargo = toml.parse(
      filesystem.read(`${process.cwd()}/cargo.toml`, 'utf8')
    ).package
  } catch {}
  const configFile =
    filesystem.read(`${process.cwd()}/.oranda.config.json`, 'json') || {}

  const metaInCargo = cargo.metadata
    ? Object.keys(cargo.metadata.oranda || {})
        .map((k) => ({
          [camelize(k)]: cargo.metadata.oranda[k],
        }))
        .reduce((acc, curr) => ({ ...acc, ...curr }), {})
    : {}

  const options = {
    ...defaultOptions,
    version,
    name,
    description,
    homepage,
    repository: repository?.url,
    ...cargo,
    ...oranda,
    ...metaInCargo,
    ...configFile,
  }

  return { options }
}

module.exports = { readOptions, defaultOptions }

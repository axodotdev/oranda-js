const { readOptions, defaultOptions } = require('./readOptions')

const AVAILABLE_THEMES = [
  'dark-plus',
  'dracula-soft',
  'dracula',
  'github-dark-dimmed',
  'github-dark',
  'github-light',
  'hc_light',
  'light-plus',
  'material-darker',
  'material-default',
  'material-lighter',
  'material-ocean',
  'material-palenight',
  'min-dark',
  'min-light',
  'monokai',
  'nord',
  'one-dark-pro',
  'poimandres',
  'rose-pine-dawn',
  'rose-pine-moon',
  'rose-pine',
  'slack-dark',
  'slack-ochin',
  'solarized-dark',
  'solarized-light',
  'vitesse-dark',
  'vitesse-light',
]

const syntaxThemeToUse = ({ filesystem }) => {
  const { options } = readOptions({ filesystem })

  const darkThemeExists = AVAILABLE_THEMES.includes(
    options.syntaxHighlight.dark
  )

  const axoThemeExists = AVAILABLE_THEMES.includes(options.syntaxHighlight.dark)
  const lightThemeExists = AVAILABLE_THEMES.includes(
    options.syntaxHighlight.light
  )

  const darkThemes = {
    axo: axoThemeExists
      ? options.syntaxHighlight.axo
      : defaultOptions.syntaxHighlight.axo,
    dark: darkThemeExists
      ? options.syntaxHighlight.dark
      : defaultOptions.syntaxHighlight.dark,
  }
  const shikiThemes = {
    theme: {
      dark: darkThemes[options.theme],
      light: lightThemeExists
        ? options.syntaxHighlight.light
        : defaultOptions.syntaxHighlight.light,
    },
  }

  return shikiThemes
}

module.exports = { syntaxThemeToUse }

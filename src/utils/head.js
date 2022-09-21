module.exports = ({
  description,
  name,
  homepage,
  meta = [],
  remoteStyles = [],
  remoteScripts = [],
  favicon,
  darkTheme,
  shareCard,
}) => {
  const metaTags = meta
    .map((value) => {
      if (!value.content) return null
      const content = value.content
      delete value.content
      const key = Object.keys(value)[0]
      const v = Object.values(value)[0]
      return `<meta ${key}="${v}" content="${content}" />`
    })
    .filter((exists) => exists)
  const remoteStylesCleaned =
    typeof remoteStyles === 'string' ? [remoteStyles] : remoteStyles
  const remoteScriptsCleaned =
    typeof remoteScripts === 'string' ? [remoteScripts] : remoteScripts

  return /*html*/ `
  <meta charset="utf-8" />
  <meta http-equiv="x-ua-compatible" content="ie=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  ${
    favicon
      ? /*html*/ `
      <meta name="image" content="${favicon}">
      <meta itemprop="image" content="${favicon}">
      `
      : ''
  }
  <meta property="og:type" content="website">
  ${
    name
      ? /*html*/ `
      <meta itemprop="name" content="${name}">
      <meta property="og:title" content="${name}">
      <meta property="og:site_name" content="${name}">
      `
      : ''
  }
  ${
    description
      ? /*html*/ `
      <meta name="description" content="${description}">
      <meta itemprop="description" content="${description}">
      <meta property="og:description" content="${description}">
      `
      : ''
  }
  ${homepage ? `<meta property="og:url" content="${homepage}">` : ''}
  ${
    shareCard && shareCard.includes('http')
      ? /*html*/ `
      <meta name="twitter:card" content="summary_large_image">
      <meta property="og:image" content="${shareCard}">
      `
      : ''
  }
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="${
    darkTheme ? 'dark' : 'white'
  }">
  ${metaTags.join('')}
  ${
    remoteStylesCleaned.length
      ? remoteStylesCleaned
          .map((link) => `<link rel="stylesheet" href="${link}">`)
          .join('')
      : ''
  }
  ${
    remoteScriptsCleaned.length
      ? remoteScriptsCleaned
          .map((link) => `<script src="${link}"></script>`)
          .join('')
      : ''
  }
`
}

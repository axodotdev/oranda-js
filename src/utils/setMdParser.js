const snarkdown = require('snarkdown')
const iterator = require('markdown-it-for-inline')

const setUpMarkdownParser = () => {
  const md = require('markdown-it')({
    html: true,
    xhtmlOut: true,
    linkify: true,
  })

  md.use(require('markdown-it-inline-comments'))
  md.use(require('markdown-it-checkbox'))
  md.use(require('markdown-it-github-headings'))
  md.use(require('markdown-it-anchor'), {
    level: 1,
  })
  md.use(require('markdown-it-emoji'))

  md.linkify.tlds('.md', false)
  md.linkify.tlds('.MD', false)
  md.use(iterator, 'url_new_win', 'link_open', function (tokens, idx) {
    const aIndex = tokens[idx].attrIndex('target')
    const hrefIndex = tokens[idx].attrIndex('href')

    if (tokens[idx].attrs[hrefIndex][1].startsWith('#')) return

    if (aIndex < 0) {
      tokens[idx].attrPush(['target', '_blank'])
    } else {
      tokens[idx].attrs[aIndex][1] = '_blank'
    }
  })
  const defaultRender =
    md.renderer.rules.html_block ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options)
    }

  md.renderer.rules.html_block = function (tokens, idx, options, env, self) {
    const htmlBlock = tokens[idx]
    tokens[idx].content = snarkdown(htmlBlock.content)

    return defaultRender(tokens, idx, options, env, self)
  }

  return md
}

module.exports = {
  setUpMarkdownParser,
}

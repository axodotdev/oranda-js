const ghpages = require('gh-pages')
const { MESSAGES } = require('../utils/constants/messages')
const { readOptions } = require('../utils/readOptions')
const { run } = require('./oranda')

module.exports = {
  name: 'deploy',
  alias: 'd',
  description: 'Deploy your static site to Github pages',
  run: async (toolbox) => {
    const {
      print: { spin, warning },
      filesystem,
    } = toolbox

    const { options } = readOptions({ filesystem })

    const dist = options.dist
    const distFolder = `${process.cwd()}/${dist}`
    const deploymentOptions = options.deployment || {}

    if (!filesystem.exists(distFolder)) {
      warning(MESSAGES.deploy_needs_build(dist))
      await run(toolbox)
    }

    const spinner = spin('Deploying your site')
    ghpages.publish(distFolder, deploymentOptions, (err) => {
      if (err) {
        return spinner.fail(MESSAGES.deploy_error)
      }
      return spinner.succeed(MESSAGES.deploy_success)
    })
  },
}

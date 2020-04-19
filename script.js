const routesGenerator = require('./routesGenerator')
const fileBuilder = require('./filesBuilder')

function getDependencies (additionalDependencies) {
  return additionalDependencies
    .reduce((acc, dependency) => {
      return {
        ...acc,
        [dependency.name]: dependency.version
      }
    }, {})
}

module.exports = function (fastify, opts, done) {
  fastify.decorate('filesBuilder', new fileBuilder.FilesBuilder())
  
  fastify.decorate('updateRoutes', async function (user, repoName, message, branch, routes, additionalDependencies=[]) {
    const fileRoutes = {
        filePath: 'routes/index.js',
        content: routesGenerator(routes)
    }
    let files = [fileRoutes]
    if (additionalDependencies.length > 0) {
      files.push(this.filesBuilder.getPackageJson(getDependencies(additionalDependencies)))
    }
    await this.githubClient.commitFiles(
        files,
        message,
        user,
        repoName,
        branch
    )
  })
  fastify.decorate('initRepository', async function (user, repoName, branch) {
    const message = 'Init service'
    await this.githubClient.commitFiles(
      this.filesBuilder.getAllFiles(),
      message,
      user,
      repoName,
      branch
  )
  })

  done()
}

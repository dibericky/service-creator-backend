const routesGenerator = require('./routesGenerator')
const GithubClient = require('./GithubClient')
const mapInitFiles = require('./createFiles')

const initFiles = getInitFiles(mapInitFiles)

const accessToken = process.env.PERSONAL_ACCESS_TOKEN

module.exports = function (fastify, opts, done) {
  fastify.decorate('githubClient', new GithubClient(accessToken))
  fastify.decorate('updateRoutes', async function (user, repoName, message, branch, routes) {
    const fileRoutes = {
        filePath: 'routes/index.js',
        content: routesGenerator(routes)
    }
    this.githubClient.commitFiles(
        [fileRoutes],
        message,
        user,
        repoName,
        branch
    )
  })
  fastify.decorate('initRepository', async function (user, repoName, branch) {
    const message = 'Init service'
    this.githubClient.commitFiles(
      initFiles,
      message,
      user,
      repoName,
      branch
  )
  })

  done()
}


function getInitFiles (mapInit) {
  return Object.keys(mapInit).map(path => ({
    filePath: path,
    content: mapInit[path]
  }))
}
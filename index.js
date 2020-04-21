require('dotenv').config()

const fastify = require('fastify')({
  logger: true
})
const fp = require('fastify-plugin')

const GithubClient = require('./GithubClient')

const accessToken = process.env.PERSONAL_ACCESS_TOKEN

fastify.decorate('githubClient', new GithubClient(accessToken))

fastify.register(fp(require('./script')))

fastify.register(fp(require('./dependencies')))

fastify.post('/routes', async function (request, reply) {
  const {body} = request
  const {user, repoName, message, branch, routes, additionalDependencies} = body
  await this.updateRoutes(user, repoName, message, branch, routes, additionalDependencies)
  reply.send({})
})

fastify.post('/init', async function (request, reply) {
  const {body} = request
  const {user, repoName, branch} = body
  await this.initRepository(user, repoName, branch)
  reply.send({
    init: true
  })
})

fastify.get('/is-up', function (request, reply) {
  reply.send({status: 'ok'})
})

fastify.listen(3000, '0.0.0.0', (err, address) => {
      if (err) throw err
      fastify.log.info(`server listening on ${address}`)
})

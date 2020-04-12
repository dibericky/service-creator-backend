const fastify = require('fastify')({
      logger: true
})
const fp = require('fastify-plugin')

fastify.register(fp(require('./script')))

fastify.post('/routes', async function (request, reply) {
  const {body} = request
  const {user, repoName, message, branch, routes} = body
  await this.updateRoutes(user, repoName, message, branch, routes)
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

fastify.listen(3000, (err, address) => {
      if (err) throw err
      fastify.log.info(`server listening on ${address}`)
})
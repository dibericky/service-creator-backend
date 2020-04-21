const npmSearch = require('libnpmsearch')

const schema = {
  querystring: {
    q: {type: 'string'},
    limit: {
      type: 'number', 
      default: 20
    }
  },
  response: {
    '2xx': {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {type: 'string'},
          version: {type: 'string'}
        }
      }
    }
  }
}
module.exports = function (fastify, opts, done) {
    fastify.get('/dependencies', { schema }, async function (request, reply) {
        const {q, limit} = request.query
        if (!q) {
          reply.status(400)
          return reply.send({
            error: 'query parameter q is required'
          })
        }
        const modules = await npmSearch(q, {
          limit
        })
        reply.send(modules)
      })

    done()
}
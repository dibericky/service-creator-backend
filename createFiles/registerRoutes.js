module.exports = `const routes = require('./routes')

module.exports = function (fastify, opts, done) {
  
    routes.forEach(route => {
        const {method, path, handler} = route
        fastify[method](path, handler)
    })

  done()
}
`
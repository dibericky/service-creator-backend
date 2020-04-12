const Handlebars = require('handlebars')

const ROUTES_TEMPLATE = `
module.exports = [
    {{#each routes}}
    {
        method: "{{method}}",
        path: "{{path}}",
        handler: {{handler}}
    },
    {{/each}}
]
`
module.exports = function (routes) {
    Handlebars.registerHelper('escape', function(variable) {
        return variable.replace(/(['"])/g, '\\$1');
      });
    const template = Handlebars.compile(ROUTES_TEMPLATE, {noEscape: true})
  /*  const routes = [{
        method: 'get',
        path: '/',
        handler: `function(req, reply) {
            reply.send({
                foo: 'lorem'
            })
          }`
    }]*/
    
    const routesGenerated = template({routes})
    return routesGenerated
}



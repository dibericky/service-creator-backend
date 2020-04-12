const PACKAGE_JSON = require('./packageJson')
const GITIGNORE = require('./gitignore')
const REGISTER_ROUTES = require('./registerRoutes')
const ROUTES_INDEX = require('./routesIndex')
const INDEX = require('./indexFile')

module.exports = {
    'package.json': PACKAGE_JSON,
    '.gitignore': GITIGNORE,
    'registerRoutes.js': REGISTER_ROUTES,
    'routes/index.js': ROUTES_INDEX,
    'index.js': INDEX
}

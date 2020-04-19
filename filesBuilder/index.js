const packageJsonBuilder = require('./packageJson')
const GITIGNORE = require('./gitignore')
const REGISTER_ROUTES = require('./registerRoutes')
const ROUTES_INDEX = require('./routesIndex')
const INDEX = require('./indexFile')

const PACKAGE_JSON_PATH = 'package.json'
const GITIGNORE_PATH = '.gitignore'
const REGISTER_ROUTES_PATH = 'registerRoutes.js'
const ROUTES_INDEX_PATH = 'routes/index.js'
const INDEX_PATH = 'index.js'

function getFilePathWithContent (filePath, content) {
    return {
        filePath,
        content
      }
}
module.exports.FilesBuilder = class FilesBuilder {

    getAllFiles() {
        return [
            this.getPackageJson(),
            this.getGitIgnore(),
            this.getRegisterRoutes(),
            this.getRoutesIndex(),
            this.getIndex()
        ]
    }
    getPackageJson(additionalDependency={}) {
        const packageJson = packageJsonBuilder({dependencies: additionalDependency})
        const stringifiedPackageJson = JSON.stringify(packageJson, null, 2)
        return getFilePathWithContent(PACKAGE_JSON_PATH, stringifiedPackageJson)
    }

    getGitIgnore() {
        return getFilePathWithContent(GITIGNORE_PATH, GITIGNORE)
    }

    getRegisterRoutes() {
        return getFilePathWithContent(REGISTER_ROUTES_PATH, REGISTER_ROUTES)
    }

    getRoutesIndex () {
        return getFilePathWithContent(ROUTES_INDEX_PATH, ROUTES_INDEX)
    }

    getIndex () {
       return getFilePathWithContent(INDEX_PATH, INDEX)
    }
}

module.exports.PACKAGE_JSON_PATH
module.exports.GITIGNORE_PATH
module.exports.REGISTER_ROUTES_PATH
module.exports.ROUTES_INDEX_PATH
module.exports.INDEX_PATH
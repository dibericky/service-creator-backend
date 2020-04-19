module.exports = function ({
  dependencies={},
  author,
  name
}={}) {
  return {
    "name": name,
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "test": "test",
      "start": "node index"
    },
    "author": author,
    "license": "ISC",
    "dependencies": {
      "fastify": "^2.13.1",
      ...dependencies
    }
  }
}
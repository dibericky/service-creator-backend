module.exports = function ({dependencies={}}={}) {
  return {
    "name": "serverless-function-test",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "test": "test",
      "start": "node index"
    },
    "author": "Riccardo Di Benedetto",
    "license": "ISC",
    "dependencies": {
      "fastify": "^2.13.1",
      ...dependencies
    }
  }
}
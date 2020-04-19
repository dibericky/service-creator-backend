const Fastify = require('fastify')
const fp = require('fastify-plugin')
const scriptPlugin = require('./script')


describe('initRepository', () => {
    const USER = 'my-user'
    const REPO_NAME = 'my-repo-name'
    const BRANCH = 'my-branch'

    describe('calls githubClient.commitFiles with correct initial files', () => {
        let githubClient
        let fastify
        beforeEach(async () => {
            githubClient = mockGithubClient()
            fastify = await buildFastifyTest({githubClient})
            fastify.initRepository(USER, REPO_NAME, BRANCH) 
            expect(githubClient.commitFiles).toHaveBeenCalledTimes(1)
        })
        afterEach(() => {
            fastify.close()
        })

        test.each([
            'package.json',
            '.gitignore',
            'registerRoutes.js',
            'routes/index.js',
            'index.js',
        ])('%s', (filePath) => {
            const file = getCommittedFile({githubClient, filePath})
            expect(file.content).toMatchSnapshot()
        })
    })
    
})

describe('updateRoutes', () => {
    const USER = 'my-user'
    const REPO_NAME = 'my-repo-name'
    const BRANCH = 'my-branch'

    describe('when there are NO dependency added', () => {
        const ROUTES = ROUTES_WITH_NO_DEPS()
        const MESSAGE = 'my message'

        let githubClient
        let fastify
        beforeEach(async () => {
            githubClient = mockGithubClient()
            fastify = await buildFastifyTest({githubClient})
            fastify.updateRoutes(USER, REPO_NAME, MESSAGE, BRANCH, ROUTES) 
            expect(githubClient.commitFiles).toHaveBeenCalledTimes(1)
        })
        afterEach(() => {
            fastify.close()
        })
        test('calls githubClient.commitFiles only routes', () => {
            expect(getCommitFilesInitFilesLastCall({githubClient})).toHaveLength(1)

            const file = getCommittedFile({githubClient, filePath: 'routes/index.js'})
            expect(file.content).toMatchSnapshot()
        })
    })

    describe('when there are dependency added', () => {
        const ROUTES = ROUTES_WITH_DEPS()
        const DEPS = ADDITIONAL_DEPS()
        const MESSAGE = 'my message'

        let githubClient
        let fastify
        beforeEach(async () => {
            githubClient = mockGithubClient()
            fastify = await buildFastifyTest({githubClient})
            fastify.updateRoutes(USER, REPO_NAME, MESSAGE, BRANCH, ROUTES, DEPS) 
            expect(githubClient.commitFiles).toHaveBeenCalledTimes(1)
        })
        afterEach(() => {
            fastify.close()
        })
        test('calls githubClient.commitFiles with routes and packageJson updated', () => {
            expect(getCommitFilesInitFilesLastCall({githubClient})).toHaveLength(2)

            const routes = getCommittedFile({githubClient, filePath: 'routes/index.js'})
            expect(routes.content).toMatchSnapshot()

            const packageJson = getCommittedFile({githubClient, filePath: 'package.json'})
            expect(packageJson.content).toMatchSnapshot()
        })
    })
    
})


function mockGithubClient () {
    return {
        commitFiles: jest.fn().mockResolvedValue()
    }
}

async function buildFastifyTest({githubClient}) {
    const fastify = Fastify({
        logger: true
    })
    fastify.decorate('githubClient', githubClient)
    scriptPlugin(fastify, {}, ()=>{})

    return fastify
}


function getCommittedFile({githubClient, filePath}) {
    const files = getCommitFilesInitFilesLastCall({githubClient})
    return files.find(file => file.filePath === filePath)
}

function getCommitFilesInitFilesLastCall({githubClient}) {
    return githubClient.commitFiles.mock.calls[0][0]
}

function ROUTES_WITH_NO_DEPS() {
    return [{
        method: 'get',
        path: '/foo',
        handler: `function (req, res) {
            res.send({foo: 'bar'})
        }
        `
    }, {
        method: 'post',
        path: '/bar',
        handler: `function (req, res) {
            res.send({foo: req.body})
        }
        `}
    ]
}

function ROUTES_WITH_DEPS() {
    return [{
        method: 'get',
        path: '/foo',
        handler: `async function (req, res) {
            const axios = require('axios')
            const response = await axios.get('http://example.com/json')
            res.send({foo: response.body})
        }
        `,
    }, {
        method: 'post',
        path: '/bar',
        handler: `function (req, res) {
            res.send({foo: req.body})
        }
        `}
    ]
}

function ADDITIONAL_DEPS() {
    return [{
        name: "axios",
        version: "^0.19.2",
    }]
}
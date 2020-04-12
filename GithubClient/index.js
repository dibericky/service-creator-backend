const {Octokit} = require('@octokit/rest')

module.exports = class GithubClient {
    constructor(access_token) {
        this.client = new Octokit({
            auth: access_token
        })
    }

    async getPublicReposByUser(user) {
        const repos = await this.client.repos.listForUser({  
            username: user
        })
        return repos
    }

    async createRepoInOrganization (org, name) {
        await this.client.repos.createInOrg({ org, name, auto_init: true })
    }

    async getCurrentCommit (owner, repositoryName, branch='master') {
        const { data: refData } = await this.client.git.getRef({
            owner,
            repo: repositoryName,
            ref: `heads/${branch}`,
          })
          const commitSha = refData.object.sha
          const { data: commitData } = await this.client.git.getCommit({
            owner,
            repo: repositoryName,
            commit_sha: commitSha,
          })
          return {
            commitSha,
            treeSha: commitData.tree.sha,
          }
    }

    async commitFiles (files, message, user, repositoryName, branch) {
        const currentCommit = await this.getCurrentCommit(user, repositoryName, branch)
        const filesWithBlob = await Promise.all(files.map(createBlobForFile(this.client, user, repositoryName)))
        const newTree = await createNewTree(
            this.client,
            user,
            repositoryName,
            filesWithBlob,
            currentCommit.treeSha
          )
        console.log('Created new Tree')
        const newCommit = await createNewCommit(
          this.client,
          user,
          repositoryName,
          message,
          newTree.sha,
          currentCommit.commitSha
        )
        console.log('Created commit')
        await setBranchToCommit(this.client, user, repositoryName, newCommit.sha, branch)
        console.log('Updated tree')
    }
}


function createBlobForFile(client, owner, repositoryName) {
    return async ({filePath, content}) => {
        const blobData = await client.git.createBlob({
        owner,
        repo: repositoryName,
        content,
        encoding: 'utf-8',
        })
        return {data: blobData.data, filePath}
    }
}

async function createNewTree(client, owner, repositoryName, files, parentTreeSha) {
    const tree = files.map(({data: { sha }, filePath}) => ({
      path: filePath,
      mode: `100644`,
      type: `blob`,
      sha,
    }))
  
    const { data } = await client.git.createTree({
        owner,
        repo: repositoryName,
        tree,
        base_tree: parentTreeSha,
      })
      return data
}

async function createNewCommit(client, owner, repositoryName, message, currentTreeSha, currentCommitSha) {
    const response = await client.git.createCommit({
        owner,
        repo: repositoryName,
        message,
        tree: currentTreeSha,
        parents: [currentCommitSha],
      })
    return response.data
}

async function setBranchToCommit(client, owner, repositoryName, commitSha, branch = `master`) {
    return client.git.updateRef({
        owner,
        repo: repositoryName,
        ref: `heads/${branch}`,
        sha: commitSha,
      })
}
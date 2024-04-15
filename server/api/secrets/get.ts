import { serverSupabaseUser } from '#supabase/server'
import { Octokit } from '@octokit/core'
import { getToken } from '~/server/data/user'
import { getSavedSecrets } from '~/server/data/secrets'

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    const token = await getToken(user.id)
    const username = user.user_metadata.user_name
    const repoName = "";
    const octokit = new Octokit({
        auth: token
    });
    const tempSecrets = await getSecrets(user, repoName, octokit)
    const publicKey = getPublicKey(user, repoName, octokit)
    const savedSecrets = await getSavedSecrets(user, repoName)
    return tempSecrets
})


async function getSecrets(owner, repo,octokit) {
    const response = await octokit.request('GET /repos/{owner}/{repo}/actions/secrets', {
        owner: owner,
        repo: repo,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
          'Accept': 'application/vnd.github.v3+json'
        }
      })
      const tempSecrets = response.data.secrets
      return tempSecrets
}

async function getPublicKey(owner, repo, octokit) {
    const response = await octokit.request('GET /repos/{owner}/{repo}/actions/secrets/public-key', {
        owner: owner,
        repo: repo,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
      const key = response.data
      return key.key
}
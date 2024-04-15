import { serverSupabaseUser } from '#supabase/server'
import { Octokit } from '@octokit/core'
import { getToken } from '~/server/data/user'
import { getSavedSecrets, rmSavedSecretsRmFromGh, upsertPublicKey } from '~/server/data/secrets'

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    const token = await getToken(user.id)
    const username = user.user_metadata.user_name
    const repoName = "";
    const octokit = new Octokit({
        auth: token
    });
    const tempSecrets = await getSecrets(user?.id, repoName, octokit)
    const savedSecrets = await getSavedSecrets(user?.id, repoName)
    const mergedSecrets = tempSecrets.map(secret => {
        return {
            name: secret.name,
            visibility: "password",
            value: savedSecrets.find(savedSecret => savedSecret.name === secret.name)?.value
        }
    })
    rmSavedSecretsRmFromGh(tempSecrets, savedSecrets, repoName, user?.id)
    getPublicKey(user?.id, repoName, octokit)
    return mergedSecrets
})


async function getSecrets(owner: string, repo: string, octokit: Octokit) {
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

async function getPublicKey(owner: string, repo: string, octokit: Octokit) {
    const response = await octokit.request('GET /repos/{owner}/{repo}/actions/secrets/public-key', {
        owner: owner,
        repo: repo,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })
    const key = response.data
    return await upsertPublicKey(owner, repo, key.key, key.key_id)
}
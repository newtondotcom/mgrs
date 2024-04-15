import { serverSupabaseUser } from '#supabase/server'
import { Octokit } from '@octokit/core'
import { getToken } from '~/server/data/user'
import { getPublicKeySaved, getSavedSecrets, mergeSecretsGhPrisma, upsertPublicKey } from '~/server/data/secrets'
import { decrypt } from '~/server/data/crypto';

let token = "";
let user_id = "";
let octokit : Octokit;

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    const config = useRuntimeConfig(event)
    token = await getToken(user.id) || "";
    user_id = user.id 
    const username = user.user_metadata.user_name
    const repoName = getQuery(event).name
    octokit = new Octokit({
        auth: token
    });
    console.log(token, user_id, username, repoName)
    const tempSecrets = await getSecrets(username, repoName)
    const savedSecrets = await getSavedSecrets(user?.id, repoName)
    const mergedSecrets = tempSecrets.map(secret => {
        let value = savedSecrets.find(savedSecret => savedSecret.name === secret.name)?.value;
        let decryptedValue = value ? decrypt(value, config.public.ENCRYPTION_KEY) : "";
        return {
            name: secret.name,
            visibility: "password",
            value: decryptedValue
        }
    })
    mergeSecretsGhPrisma(tempSecrets, savedSecrets, repoName, user?.id)
    getPublicKey(username, repoName)
    return mergedSecrets
})


async function getSecrets(owner: string, repo: string) {
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

async function getPublicKey(owner: string, repo: string) {
    const keySaved = await getPublicKeySaved(user_id, repo)
    if (keySaved?.public_key && keySaved?.key_id) {
        return keySaved
    }
    const response = await octokit.request('GET /repos/{owner}/{repo}/actions/secrets/public-key', {
        owner: owner,
        repo: repo,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })
    const key = response.data
    return await upsertPublicKey(user_id, repo, key.key, key.key_id)
}
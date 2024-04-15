import { serverSupabaseUser } from '#supabase/server'
import { Octokit } from '@octokit/core'
import { getToken } from '~/server/data/user'
import { cryptSecret, encrypt } from '~/server/data/crypto'
import { getPublicKeySaved, upsertSecret } from '~/server/data/secrets'

export default defineEventHandler(async (event) => {    
    const user = await serverSupabaseUser(event)
    const config = useRuntimeConfig(event)
    const token = await getToken(user.id)
    const username = user.user_metadata.user_name
    const body = await readBody(event)
    const repoName = body.name;
    const secretName = body.secret;
    const value = body.value;
    const publicKey = await getPublicKeySaved(user.id, repoName);
    const encryptedValue = await cryptSecret(value, publicKey.public_key)
    const octokit = new Octokit({
        auth: token
    });
    console.log(username, repoName, secretName, value, publicKey, encryptedValue)
    const response = await octokit.request('PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}', {
      owner: username,
      repo: repoName,
      secret_name: secretName,
      encrypted_value: encryptedValue,
      key_id: publicKey.key_id,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    const encryptedValueDb = await encrypt(value, config.public.ENCRYPTION_KEY);
    await upsertSecret(user.id, repoName, secretName, encryptedValueDb)
    if (response.status === 201) {
      return response.data
    }
}) 
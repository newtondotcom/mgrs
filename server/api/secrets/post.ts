import { serverSupabaseUser } from '#supabase/server'
import { Octokit } from '@octokit/core'
import { getToken } from '~/server/data/user'
import { cryptSecret } from '~/server/data/crypto'
import { getPublicKeySaved } from '~/server/data/secrets'

export default defineEventHandler(async (event) => {    
    const user = await serverSupabaseUser(event)
    const token = await getToken(user.id)
    const username = user.user_metadata.user_name
    const body = await readBody(event)
    const repoName = body.name;
    const secretName = body.secret;
    const value = body.value;
    const publicKey = await getPublicKeySaved(user.id, repoName);
    const encryptedValue = await cryptSecret(value, publicKey.key);
    const octokit = new Octokit({
        auth: token
    });
    const response = await octokit.request('PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}', {
      owner: username,
      repo: repoName,
      secret_name: secretName,
      encrypted_value: secretName,
      key_id: publicKey.key_id,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    if (response.status === 201) {
      return response.data
    }
}) 
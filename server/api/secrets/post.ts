import { serverSupabaseUser } from '#supabase/server'
import { Octokit } from '@octokit/core'
import { getToken } from '~/server/data/user'
import { cryptSecretGh, encryptSecretGhPrisma } from '~/server/data/crypto'
import { getPublicKeySaved, upsertSecret } from '~/server/data/secrets'

export default defineEventHandler(async (event) => {    
    const user = await serverSupabaseUser(event)
    const config = useRuntimeConfig(event)
    const token = await getToken(user.id)
    const username = user.user_metadata.user_name
    const body = await readBody(event)
    const repoName = body.repo_name;
    const secretName = body.secret_name.toUpperCase();
    const value = body.secret_value;
    console.log('repoName :', repoName, ', secretName :', secretName, ', value :', value)
    const publicKey = await getPublicKeySaved(user.id, repoName);
    const encryptSecretGhPrismaedValue = await cryptSecretGh(value, publicKey.public_key)
    const octokit = new Octokit({
        auth: token
    });
    const response = await octokit.request('PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}', {
      owner: username,
      repo: repoName,
      secret_name: secretName,
      encryptSecretGhPrismaed_value: encryptSecretGhPrismaedValue,
      key_id: publicKey.key_id,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    const encryptSecretGhPrismaedValueDb = await encryptSecretGhPrisma(value, config.public.encryptSecretGhPrismaION_KEY);
    await upsertSecret(user.id, repoName, secretName, encryptSecretGhPrismaedValueDb)
    return response
}) 
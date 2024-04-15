import { serverSupabaseUser } from '#supabase/server'
import { Octokit } from '@octokit/core'
import { getToken } from '~/server/data/user'

export default defineEventHandler(async (event) => {    
    const user = await serverSupabaseUser(event)
    const token = await getToken(user.id)
    const username = user.user_metadata.user_name
    const query = getQuery(event)
    const repoName = query.name
    const secretName = query.secret
    const octokit = new Octokit({
        auth: token
    });
    await octokit.request('DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}', {
        owner: username,
        repo: repoName,
        secret_name: secretName,
        headers: {
        'X-GitHub-Api-Version': '2022-11-28'
        }
    })
})
import { serverSupabaseUser } from '#supabase/server'
import { mergeRepos } from '../data/repos';
import { getToken } from '../data/user';
import { Octokit } from "@octokit/core";

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    const token = await getToken(user.id)
    const octokit = new Octokit({
        auth: token
    });

    const response = await octokit.request('GET /user/repos', {
        type: "owner",
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        },
        per_page: 1000
    });
    const ghRepos = response.data;
    mergeRepos(ghRepos, user.id);
    return ghRepos;
});


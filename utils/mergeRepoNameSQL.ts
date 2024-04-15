import { Octokit } from "@octokit/core";
import { TRepo, type IRepo } from "~/types/types";
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const access_token_cookie = await getToken();
const octokit = new Octokit({
    auth: access_token_cookie
});

const response = await octokit.request('GET /user/repos', {
    type: "owner",
    headers: {
        'X-GitHub-Api-Version': '2022-11-28'
    },
    per_page: 1000
});

const tempRepos = response.data as any[];

const datas: IRepo[] = tempRepos.map((data) => ({
    repository_id: data.id,
    repository_name: data.name,
    user_id: user.value.id
}));

const storedRepos = await supabase.from<IRepo>(TRepo).select('*').eq('user_id', user.value.id);

if (storedRepos.data.length === 0) {
    await supabase.from<IRepo>(TRepo).insert(datas);
} else {
    for (const repo of storedRepos.data) {
        const found = datas.find((data) => data.repository_name === repo.repository_name);
        if (!found) {
            const renamed = datas.find((data) => data.repository_id === repo.repository_id);
            if (renamed) {
                await supabase.from<IRepo>(TRepo).update({ repository_name: renamed.repository_name }).eq('repository_id', repo.repository_id);
            }
        }
    }
}

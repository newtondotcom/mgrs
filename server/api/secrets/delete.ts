import { serverSupabaseUser } from '#supabase/server';
import { Octokit } from '@octokit/core';
import { getToken } from '~/server/data/user';

// Define the event handler for the main event
export default defineEventHandler(async (event) => {    
    // Retrieve the Supabase user associated with the event
    const user = await serverSupabaseUser(event);

    // Retrieve the GitHub token for the user
    const token = await getToken(user?.id as string);

    // Extract user metadata
    const username = user?.user_metadata.user_name;

    // Extract query parameters from the event
    const query = getQuery(event);

    // Extract repository name and secret name from the query parameters
    const repoName = query.name;
    const secretName = query.secret;

    // Initialize Octokit with the user's GitHub token
    const octokit = new Octokit({
        auth: token
    });

    // Make a request to delete the specified secret from the repository
    await octokit.request('DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}', {
        owner: username,
        repo: repoName as string,
        secret_name: secretName as string,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    });

    // The deletion is performed asynchronously and no explicit return value is provided
});

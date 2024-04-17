import { RepoRenamedAndCreateInPrisma } from '../data/repos';
import { getToken } from '../data/user';
import { Octokit } from "@octokit/core";

// Define the event handler for the main event
export default defineEventHandler(async (event) => {
    // Extract user_id from event context
    const user_id = event.context.user_id;
    
    // Retrieve GitHub token for the user
    const token = await getToken(user_id);
    
    // Initialize Octokit with the user's token
    const octokit = new Octokit({ auth: token });

    // Make a request to fetch user's repositories from GitHub
    const response = await octokit.request('GET /user/repos', {
        type: "owner",
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        },
        per_page: 1000
    });

    // Extract GitHub repositories from the response
    const ghRepos = response.data;
    
    // Process and save GitHub repositories in Prisma
    RepoRenamedAndCreateInPrisma(ghRepos, user_id);
    
    // Return fetched GitHub repositories
    return ghRepos;
});

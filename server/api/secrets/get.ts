import { serverSupabaseUser } from '#supabase/server';
import { Octokit } from '@octokit/core';
import { getToken } from '~/server/data/user';
import { getPublicKeySaved, getSavedSecrets, mergeSecretsGhPrisma, upsertPublicKey } from '~/server/data/secrets';
import { decryptSecretGhPrisma } from '~/server/data/crypto';

// Global variables for token, user_id, and Octokit instance
let token = "";
let user_id = "";
let octokit: Octokit;

// Define the event handler for the main event
export default defineEventHandler(async (event) => {
  // Retrieve the Supabase user from the event
  const user = await serverSupabaseUser(event);
  // Get runtime configuration
  const config = useRuntimeConfig(event);

  // Retrieve or refresh the user's token
  token = (await getToken(user.id)) || "";
  user_id = user.id;
  const username = user.user_metadata.user_name;
  const repoName = getQuery(event).name;

  // Initialize Octokit with the user's token
  octokit = new Octokit({ auth: token });

  // Retrieve secrets from GitHub repository
  const tempSecrets = await getSecrets(username, repoName);
  // Retrieve saved secrets from the database
  const savedSecrets = await getSavedSecrets(user_id, repoName);

  // Merge and decrypt secrets for the client
  const mergedSecrets = tempSecrets.map(secret => {
    const savedSecret = savedSecrets.find(savedSecret => savedSecret.name === secret.name);
    const value = savedSecret ? decryptSecretGhPrisma(savedSecret.value, config.public.ENCRYPTION_KEY) : "";
    
    return {
      name: secret.name,
      visibility: "password",
      value: value
    };
  });

  // Merge and upsert secrets in the database
  mergeSecretsGhPrisma(tempSecrets, savedSecrets, repoName, user_id);
  // Retrieve or update public key associated with the repository
  await getPublicKey(username, repoName);

  // Return merged secrets for the client
  return mergedSecrets;
});

// Function to retrieve secrets from a GitHub repository
async function getSecrets(owner: string, repo: string) {
  const response = await octokit.request('GET /repos/{owner}/{repo}/actions/secrets', {
    owner: owner,
    repo: repo,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  return response.data.secrets;
}

// Function to retrieve or update public key for a GitHub repository
async function getPublicKey(owner: string, repo: string) {
  const keySaved = await getPublicKeySaved(user_id, repo);

  if (keySaved?.public_key && keySaved?.key_id) {
    return keySaved;
  }

  const response = await octokit.request('GET /repos/{owner}/{repo}/actions/secrets/public-key', {
    owner: owner,
    repo: repo,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });

  const key = response.data;
  return await upsertPublicKey(user_id, repo, key.key, key.key_id);
}

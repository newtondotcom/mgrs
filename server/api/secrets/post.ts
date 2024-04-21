import { serverSupabaseUser } from '#supabase/server';
import { Octokit } from '@octokit/core';
import { getToken } from '~/server/data/user';
import { cryptSecretGh, encryptSecretGhPrisma } from '~/server/data/crypto';
import { getPublicKeySaved, upsertSecret } from '~/server/data/secrets';

export default defineEventHandler(async (event) => {
  // Get the authenticated user
  const user = await serverSupabaseUser(event);
  
  // Fetch runtime configuration
  const config = useRuntimeConfig(event);
  
  // Retrieve the user's access token
  const token = await getToken(user?.id as string);
  
  // Extract user details
  const username = user?.user_metadata.user_name;
  
  // Read the request body
  const body = await readBody(event);
  
  // Extract required data from the request body
  const repoName = body.repo_name;
  const secretName = body.secret_name.toUpperCase().replaceAll(`"`, '');
  const value = body.secret_value;
  
  // Fetch the public key associated with the repository
  const publicKey : {public_key : string, key_id : string } = await getPublicKeySaved(user?.id as string, repoName);
  
  // Encrypt the secret value using the repository's public key
  const encryptedGh = await cryptSecretGh(value, publicKey.public_key);
  
  // Initialize Octokit with the user's token
  const octokit = new Octokit({ auth: token });
  
  // Update the repository's secret using the GitHub API
  const response = await octokit.request('PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}', {
    owner: username,
    repo: repoName,
    secret_name: secretName,
    encrypted_value: encryptedGh,
    key_id: publicKey.key_id,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });
  
  // Encrypt the secret value for storage in Prisma
  const encryptedPrisma = await encryptSecretGhPrisma(value, config.public.ENCRYPTION_KEY);
  
  // Upsert (insert or update) the secret in the database
  await upsertSecret(user?.id as string, repoName, secretName, encryptedPrisma);
  
  // Return the response from GitHub API
  return response;
});

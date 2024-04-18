import { serverSupabaseUser } from '#supabase/server';
import { registerUser } from '../data/user';

// Define the event handler for the main event
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event); // Retrieve runtime configuration
  const query = getQuery(event); // Retrieve query parameters from the event

  // Check if the 'code' parameter is missing in the query
  if (!query.code) {
    return {
      error: "No code", // Return an error if 'code' parameter is missing
    };
  }

  // Construct parameters for GitHub OAuth access token request
  const params = {
    client_id: config.public.GH_CLIENT_ID,
    client_secret: config.public.GH_CLIENT_SECRET,
    code: query.code
  };

  // Make a request to GitHub OAuth to exchange code for access token
  const data : {access_token : string | null} = await $fetch("https://github.com/login/oauth/access_token", {
    params: params,
    headers: {
      "Accept": "application/json",
      "Accept-Encoding": "application/json",
    },
  });

  // Check if access_token is present in the response data
  if (data.access_token) {
    const access_token = data.access_token; // Extract the access token from response

    // Retrieve Supabase user information
    const user = await serverSupabaseUser(event);

    // Make a request to fetch GitHub user details using the access token
    const response : {login : string} = await $fetch("https://api.github.com/user", {
      headers: {
        "Authorization": `Bearer ${access_token}`,
        "Accept": "application/json",
        "Accept-Encoding": "application/json",
      },
    });

    if (!response.login) {
      return {
        error: "No username",
      };
    }

    // Register the user with the retrieved GitHub details
    registerUser(
      user?.id as string,
      access_token,
      user?.user_metadata.user_name as string,
      user?.user_metadata.avatar_url
    );

    // Return the access token and GitHub username in the response
    return {success: true}
  }

  // Return an error response if access_token is not available
  return {
    access_token: "error"
  };
});

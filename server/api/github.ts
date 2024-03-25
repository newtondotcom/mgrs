import { serverSupabaseClient,serverSupabaseUser  } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event)
    const query = getQuery(event)

    if (!query.code) {
      return {
        error: "No code",
      };
    }
    const params = {
      client_id: config.public.GITHUB_CLIENT_ID,
      client_secret: config.public.GITHUB_CLIENT_SECRET,
      code: query.code
    }

    const data = await $fetch("https://github.com/login/oauth/access_token", 
    { params : params, 
      headers: {
        "Accept": "application/json",
        "Accept-Encoding": "application/json",
      },})
    
      if (data.access_token) {
      let access_token = "";
      let refresh_token = "";
      let access_expiry = "";
      let refresh_expiry = "";
        access_token = data.access_token;
        refresh_token = data.refresh_token;
        access_expiry = data.expires_in;
        refresh_expiry = data.refresh_token_expires_in;

        const client = await serverSupabaseClient(event)
        const user = await serverSupabaseUser(event)
        /*
        const data = await client.from('tokens').insert(
          {
          access_token: access_token,
          refresh_token: refresh_token,
          access_expiry: access_expiry,
          refresh_expiry: refresh_expiry,
        })
        */

        return {
          access_token: data.access_token,
        };
        }
        return {
          access_token : "error"
        };
    });
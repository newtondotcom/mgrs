import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

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
    {
      params: params,
      headers: {
        "Accept": "application/json",
        "Accept-Encoding": "application/json",
      },
    })

  if (data.access_token) {
    let access_token = "";

    access_token = data.access_token;

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
    access_token: "error"
  };
});
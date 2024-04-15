import { serverSupabaseUser } from '#supabase/server'
import {registerUser} from '../data/user';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const query = getQuery(event)

  if (!query.code) {
    return {
      error: "No code",
    };
  }
  const params = {
    client_id: config.public.GH_CLIENT_ID,
    client_secret: config.public.GH_CLIENT_SECRET,
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

    const user = await serverSupabaseUser(event)

    const response = await $fetch("https://api.github.com/user", {
      headers: {
        "Authorization": `Bearer ${access_token}`,
        "Accept": "application/json",
        "Accept-Encoding": "application/json",
      },
    })

    registerUser(user.id, access_token)

    return {
      access_token: data.access_token,
      username : response.login,
    };
  }
  return {
    access_token: "error"
  };
});
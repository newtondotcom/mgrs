import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const config = useRuntimeConfig(event)
    const client = await serverSupabaseClient(event)
    const user = await serverSupabaseUser(event)

    const repo = query.repo

});
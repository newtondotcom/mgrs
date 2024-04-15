import { getTokens } from "../data/user"
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    const token = await getTokens(user.id)
    return token
})
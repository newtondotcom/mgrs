import { getUsernameAvatar } from "../data/user"
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    const infos = await getUsernameAvatar(user.id)
    return infos
})
import { getInfos } from "../data/user"
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    const infos = await getInfos(user.id)
    return infos
})
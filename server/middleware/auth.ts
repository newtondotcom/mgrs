import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const endpoint = event.path.split('/').pop()
    const user = await serverSupabaseUser(event)
    if (user) {
        event.context.user_id = user.id
    }
})

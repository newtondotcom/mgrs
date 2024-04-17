import { getToken } from "../data/user"

export default defineEventHandler(async (event) => {
    const user_id = event.context.user_id
    const token = await getToken(user_id)
    return token
})
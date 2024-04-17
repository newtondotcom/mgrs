import { getUsernameAvatar } from "../data/user"

export default defineEventHandler(async (event) => {
    const user_id = event.context.user_id
    const infos = await getUsernameAvatar(user_id)
    return infos
})
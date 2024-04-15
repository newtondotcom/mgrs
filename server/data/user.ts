import prisma from "~/server/data/prisma"

export default async function registerUser(user_id : string, access_token :string) {
    const userPrisma = await prisma.user.create({
        data: {
        user_id: user_id,
        access_token: access_token
        }
    })
}
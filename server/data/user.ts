import prisma from "~/server/data/prisma"

export async function registerUser(user_id : string, access_token :string) {
    const userPrisma = await prisma.user.upsert({
        where: { user_id },
        update: { access_token },
        create: { user_id, access_token }
    })
}

export async function getTokens(user_id : string) {
    return await prisma.user.findUnique({
        where: { user_id },
        select: { access_token: true }
    })
}
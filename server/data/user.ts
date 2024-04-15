import prisma from "~/server/data/prisma"

export async function registerUser(user_id : string, access_token :string, username : string, avatar_url : string) {
    console.log(username)
    const userPrisma = await prisma.user.upsert({
        where: { user_id },
        update: { access_token , username, avatar_url},
        create: { user_id, access_token , username, avatar_url},
    })
}

export async function getToken(user_id : string) {
    return await prisma.user.findUnique({
        where: { user_id },
        select : {
            access_token : true
        }
    })
}

export async function getInfos(user_id : string) {
    return await prisma.user.findUnique({
        where: { user_id },
        select : {
            username : true,
            avatar_url : true
        }
    })
}
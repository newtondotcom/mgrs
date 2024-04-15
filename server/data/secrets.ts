import prisma from "./prisma";

export async function getRepoIdfromRepoName(user_id: string, repository_name: string) {
    return await prisma.repository.findFirst({
        where: {
            repository_name,
            user_id
        }
    }).then(repo => {
        return repo?.repository_id
    })
}

export async function getSavedSecrets(user_id: string, repository_name: string) {
    const repository_id = await getRepoIdfromRepoName(user_id, repository_name)
    return await prisma.secret.findMany({
        where: {
            repository_id
        }
    })
}

export async function upsertPublicKey(user_id: string, repository_name: string, public_key: string, key_id: string) {
    const repository_id = await getRepoIdfromRepoName(user_id, repository_name)
    return await prisma.repository.update({
        where: {
            repository_id
        },
        data: {
            public_key,
            key_id
        }
    })
}

export async function upsertSecret(user_id: string, repository_name: string, secret_name: string, secret_value: string) {
    const repository_id = await getRepoIdfromRepoName(user_id, repository_name)
    return await prisma.secret.upsert({
        where: {
            repository_id,
            name : secret_name
        },
        create: {
            repository_id,
            name : secret_name,
            value : secret_value
        },
        update: {
            value : secret_value
        }
    })
}

export async function rmSavedSecretsRmFromGh(tempSecrets: any[], savedSecrets: any[], repository_name: string, user_id: string) {
    const repository_id = await getRepoIdfromRepoName(user_id,repository_name)
    // remove deleted secrets from github
    for (const tempSecret of savedSecrets) {
        if (!tempSecrets.find(savedSecret => savedSecret.name === tempSecret.name)) {
            await prisma.secret.delete({
                where: {
                    repository_id,
                    name: tempSecret.name
                }
            })
        }
    }
}
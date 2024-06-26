import prisma from "./prisma";

export async function getReposList(user_id : string) {
    return await prisma.repository.findMany({
        where: { user_id },
    })
}

export async function RepoRenamedAndCreateInPrisma(ghRepos :any[], user_id : string){
    const savedRepos = await getReposList(user_id);
    for (let i = 0; i < ghRepos.length; i++) {
        const ghRepo = ghRepos[i];
        const savedRepo = savedRepos.find((repo) => repo.repository_id === ghRepo.id);
        if (savedRepo) {
           if (savedRepo.repository_name !== ghRepo.name) {
               await prisma.repository.update({
                   where: { repository_id: savedRepo.repository_id },
                   data: { repository_name: ghRepo.name },
               })
           }
        } else {
            await prisma.repository.create({
                data: {
                    repository_id: ghRepo.id,
                    repository_name: ghRepo.name,
                    user_id,
                },
            })
        }
    }
   }
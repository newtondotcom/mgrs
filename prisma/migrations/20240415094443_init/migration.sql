-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Repository" (
    "repository_id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "repository_name" TEXT NOT NULL,

    CONSTRAINT "Repository_pkey" PRIMARY KEY ("repository_id")
);

-- CreateTable
CREATE TABLE "Secret" (
    "secret_id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "repository_id" INTEGER NOT NULL,

    CONSTRAINT "Secret_pkey" PRIMARY KEY ("secret_id")
);

-- AddForeignKey
ALTER TABLE "Repository" ADD CONSTRAINT "Repository_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Secret" ADD CONSTRAINT "Secret_repository_id_fkey" FOREIGN KEY ("repository_id") REFERENCES "Repository"("repository_id") ON DELETE RESTRICT ON UPDATE CASCADE;

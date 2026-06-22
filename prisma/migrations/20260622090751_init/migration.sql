/*
  Warnings:

  - You are about to drop the column `useriId` on the `profiles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `profiles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_useriId_fkey";

-- DropIndex
DROP INDEX "profiles_useriId_key";

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "useriId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

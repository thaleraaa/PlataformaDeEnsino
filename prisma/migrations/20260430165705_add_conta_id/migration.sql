/*
  Warnings:

  - You are about to drop the column `email` on the `Administrador` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `Administrador` table. All the data in the column will be lost.
  - You are about to drop the column `senha` on the `Administrador` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Aluno` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `Aluno` table. All the data in the column will be lost.
  - You are about to drop the column `senha` on the `Aluno` table. All the data in the column will be lost.
  - You are about to drop the column `concluido` on the `ConclusaoAula` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Professor` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `Professor` table. All the data in the column will be lost.
  - You are about to drop the column `senha` on the `Professor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[conta_id]` on the table `Administrador` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[conta_id]` on the table `Aluno` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[conta_id]` on the table `Professor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `conta_id` to the `Administrador` table without a default value. This is not possible if the table is not empty.
  - Added the required column `conta_id` to the `Aluno` table without a default value. This is not possible if the table is not empty.
  - Added the required column `conta_id` to the `Professor` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMINISTRADOR', 'PROFESSOR', 'ALUNO');

-- DropIndex
DROP INDEX "Administrador_email_key";

-- DropIndex
DROP INDEX "Aluno_email_key";

-- DropIndex
DROP INDEX "Professor_email_key";

-- AlterTable
ALTER TABLE "Administrador" DROP COLUMN "email",
DROP COLUMN "nome",
DROP COLUMN "senha",
ADD COLUMN     "conta_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Aluno" DROP COLUMN "email",
DROP COLUMN "nome",
DROP COLUMN "senha",
ADD COLUMN     "conta_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ConclusaoAula" DROP COLUMN "concluido";

-- AlterTable
ALTER TABLE "Professor" DROP COLUMN "email",
DROP COLUMN "nome",
DROP COLUMN "senha",
ADD COLUMN     "conta_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Conta" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "Conta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Conta_email_key" ON "Conta"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Administrador_conta_id_key" ON "Administrador"("conta_id");

-- CreateIndex
CREATE UNIQUE INDEX "Aluno_conta_id_key" ON "Aluno"("conta_id");

-- CreateIndex
CREATE UNIQUE INDEX "Professor_conta_id_key" ON "Professor"("conta_id");

-- AddForeignKey
ALTER TABLE "Aluno" ADD CONSTRAINT "Aluno_conta_id_fkey" FOREIGN KEY ("conta_id") REFERENCES "Conta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Administrador" ADD CONSTRAINT "Administrador_conta_id_fkey" FOREIGN KEY ("conta_id") REFERENCES "Conta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Professor" ADD CONSTRAINT "Professor_conta_id_fkey" FOREIGN KEY ("conta_id") REFERENCES "Conta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - Added the required column `nome` to the `Administrador` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `Professor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Administrador" ADD COLUMN     "nome" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Professor" ADD COLUMN     "nome" TEXT NOT NULL;

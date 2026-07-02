/*
  Warnings:

  - Added the required column `nome` to the `Aluno` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Aluno" ADD COLUMN     "nome" TEXT NOT NULL;

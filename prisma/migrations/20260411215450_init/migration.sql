/*
  Warnings:

  - You are about to drop the `administradores` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `aulas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `disciplinas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `exercicios` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `modulos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `professores` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `simulados` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "aulas" DROP CONSTRAINT "aulas_modulo_id_fkey";

-- DropForeignKey
ALTER TABLE "disciplinas" DROP CONSTRAINT "disciplinas_professor_id_fkey";

-- DropForeignKey
ALTER TABLE "exercicios" DROP CONSTRAINT "exercicios_aula_id_fkey";

-- DropForeignKey
ALTER TABLE "exercicios" DROP CONSTRAINT "exercicios_professor_id_fkey";

-- DropForeignKey
ALTER TABLE "exercicios" DROP CONSTRAINT "exercicios_simulado_id_fkey";

-- DropForeignKey
ALTER TABLE "modulos" DROP CONSTRAINT "modulos_disciplina_id_fkey";

-- DropForeignKey
ALTER TABLE "professores" DROP CONSTRAINT "professores_adm_id_fkey";

-- DropForeignKey
ALTER TABLE "simulados" DROP CONSTRAINT "simulados_professor_id_fkey";

-- DropTable
DROP TABLE "administradores";

-- DropTable
DROP TABLE "aulas";

-- DropTable
DROP TABLE "disciplinas";

-- DropTable
DROP TABLE "exercicios";

-- DropTable
DROP TABLE "modulos";

-- DropTable
DROP TABLE "professores";

-- DropTable
DROP TABLE "simulados";

-- CreateTable
CREATE TABLE "Administrador" (
    "id" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Administrador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Professor" (
    "id" TEXT NOT NULL,
    "CRM" TEXT NOT NULL,
    "salario" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "adm_id" TEXT NOT NULL,

    CONSTRAINT "Professor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Disciplina" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "professor_id" TEXT NOT NULL,

    CONSTRAINT "Disciplina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Modulo" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "disciplina_id" TEXT NOT NULL,

    CONSTRAINT "Modulo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aula" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "videoAula" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "modulo_id" TEXT NOT NULL,

    CONSTRAINT "Aula_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercicio" (
    "id" TEXT NOT NULL,
    "enunciado" TEXT NOT NULL,
    "dificuldade" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "aula_id" TEXT,
    "professor_id" TEXT NOT NULL,
    "simulado_id" TEXT,

    CONSTRAINT "Exercicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Simulado" (
    "id" TEXT NOT NULL,
    "quantidadeQuestao" INTEGER NOT NULL,
    "tempoMaximo" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "professor_id" TEXT NOT NULL,

    CONSTRAINT "Simulado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Professor_CRM_key" ON "Professor"("CRM");

-- AddForeignKey
ALTER TABLE "Professor" ADD CONSTRAINT "Professor_adm_id_fkey" FOREIGN KEY ("adm_id") REFERENCES "Administrador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disciplina" ADD CONSTRAINT "Disciplina_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "Professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Modulo" ADD CONSTRAINT "Modulo_disciplina_id_fkey" FOREIGN KEY ("disciplina_id") REFERENCES "Disciplina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aula" ADD CONSTRAINT "Aula_modulo_id_fkey" FOREIGN KEY ("modulo_id") REFERENCES "Modulo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercicio" ADD CONSTRAINT "Exercicio_aula_id_fkey" FOREIGN KEY ("aula_id") REFERENCES "Aula"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercicio" ADD CONSTRAINT "Exercicio_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "Professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercicio" ADD CONSTRAINT "Exercicio_simulado_id_fkey" FOREIGN KEY ("simulado_id") REFERENCES "Simulado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Simulado" ADD CONSTRAINT "Simulado_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "Professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

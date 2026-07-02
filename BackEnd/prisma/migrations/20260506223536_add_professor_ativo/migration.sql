-- DropForeignKey
ALTER TABLE "Aluno" DROP CONSTRAINT "Aluno_conta_id_fkey";

-- AlterTable
ALTER TABLE "Professor" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE "Aluno" ADD CONSTRAINT "Aluno_conta_id_fkey" FOREIGN KEY ("conta_id") REFERENCES "Conta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

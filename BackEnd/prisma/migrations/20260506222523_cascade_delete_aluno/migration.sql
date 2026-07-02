-- DropForeignKey
ALTER TABLE "ConclusaoAula" DROP CONSTRAINT "ConclusaoAula_aluno_id_fkey";

-- DropForeignKey
ALTER TABLE "Progresso" DROP CONSTRAINT "Progresso_aluno_id_fkey";

-- DropForeignKey
ALTER TABLE "Resultado" DROP CONSTRAINT "Resultado_aluno_id_fkey";

-- AddForeignKey
ALTER TABLE "Resultado" ADD CONSTRAINT "Resultado_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progresso" ADD CONSTRAINT "Progresso_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConclusaoAula" ADD CONSTRAINT "ConclusaoAula_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

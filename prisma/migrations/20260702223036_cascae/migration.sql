-- DropForeignKey
ALTER TABLE "Alternativa" DROP CONSTRAINT "Alternativa_exercicio_id_fkey";

-- DropForeignKey
ALTER TABLE "Exercicio" DROP CONSTRAINT "Exercicio_aula_id_fkey";

-- DropForeignKey
ALTER TABLE "Progresso" DROP CONSTRAINT "Progresso_disciplina_id_fkey";

-- AddForeignKey
ALTER TABLE "Exercicio" ADD CONSTRAINT "Exercicio_aula_id_fkey" FOREIGN KEY ("aula_id") REFERENCES "Aula"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alternativa" ADD CONSTRAINT "Alternativa_exercicio_id_fkey" FOREIGN KEY ("exercicio_id") REFERENCES "Exercicio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progresso" ADD CONSTRAINT "Progresso_disciplina_id_fkey" FOREIGN KEY ("disciplina_id") REFERENCES "Disciplina"("id") ON DELETE CASCADE ON UPDATE CASCADE;

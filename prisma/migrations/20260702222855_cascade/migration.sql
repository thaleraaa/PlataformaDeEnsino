-- DropForeignKey
ALTER TABLE "Aula" DROP CONSTRAINT "Aula_modulo_id_fkey";

-- DropForeignKey
ALTER TABLE "ConclusaoAula" DROP CONSTRAINT "ConclusaoAula_aula_id_fkey";

-- DropForeignKey
ALTER TABLE "Disciplina" DROP CONSTRAINT "Disciplina_professor_id_fkey";

-- DropForeignKey
ALTER TABLE "Modulo" DROP CONSTRAINT "Modulo_disciplina_id_fkey";

-- AddForeignKey
ALTER TABLE "Disciplina" ADD CONSTRAINT "Disciplina_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "Professor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Modulo" ADD CONSTRAINT "Modulo_disciplina_id_fkey" FOREIGN KEY ("disciplina_id") REFERENCES "Disciplina"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aula" ADD CONSTRAINT "Aula_modulo_id_fkey" FOREIGN KEY ("modulo_id") REFERENCES "Modulo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConclusaoAula" ADD CONSTRAINT "ConclusaoAula_aula_id_fkey" FOREIGN KEY ("aula_id") REFERENCES "Aula"("id") ON DELETE CASCADE ON UPDATE CASCADE;

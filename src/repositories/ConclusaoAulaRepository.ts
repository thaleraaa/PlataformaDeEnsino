import type { ConclusaoAula } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

export class ConclusaoAulaRepository {
    // create
    public async create(data: Omit<ConclusaoAula, 'id' | 'dataConclusao' | 'created_at' | 'updated_at'>) : Promise<ConclusaoAula> {
        return prisma.conclusaoAula.create({data});
    }
    // delete
    public async delete(id : string) : Promise<ConclusaoAula> {
        return prisma.conclusaoAula.delete({
            where: {
                id: id
            }
        });
    }

    public async findByAulaEAluno(idAluno : string, idAula: string) : Promise<ConclusaoAula | null> {
        return prisma.conclusaoAula.findUnique({
            where: {
                aluno_id_aula_id: {
                    aluno_id: idAluno,
                    aula_id: idAula
                }
            }
        });
    }

    public async countByDisciplinaId(idAluno : string, idDisciplina : string) : Promise<number> {
        return prisma.conclusaoAula.count({
            where: {
                aluno_id: idAluno,
                aula: {
                    modulo: {
                        disciplina_id: idDisciplina
                    }
                }
            }
        });
    }
}

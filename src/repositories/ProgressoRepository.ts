import type { Progresso } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AulaRepository } from "./AulaRepository";
import { ConclusaoAulaRepository } from "./ConclusaoAulaRepository";

export class ProgressoRepository {

    private aulaRepository = new AulaRepository();
    private conclusaoAulaRepository = new ConclusaoAulaRepository();

    public async upsert(aluno_id: string, disciplina_id: string) : Promise<Progresso | null> {

        const totalAulas = await this.aulaRepository.countByDisciplinaId(disciplina_id);

        const aulasConcluidasAluno = await this.conclusaoAulaRepository.countByDisciplinaId(aluno_id, disciplina_id);
            
        if (totalAulas === 0 || aulasConcluidasAluno === 0) {
            await prisma.progresso.delete({
                where: {
                    aluno_id_disciplina_id: {
                        aluno_id,
                        disciplina_id
                    }
                }
            });
            return null;
        }

        const porcentagem = (100 * aulasConcluidasAluno) / totalAulas
    
        // Faz upsert com a porcentagem calculada
        return prisma.progresso.upsert({
            where: {
                aluno_id_disciplina_id: {
                    aluno_id,
                    disciplina_id
                }
            },
            update: {
                porcentagemConcluida: porcentagem
            },
            create: {
                aluno_id,
                disciplina_id,
                porcentagemConcluida: porcentagem
            }
        });
    }

    public async findAll() : Promise<Progresso[]> {
        return prisma.progresso.findMany();
    }

    public async findByAlunoId(aluno_id : string) : Promise<Progresso[]> {
        return prisma.progresso.findMany({
            where: {
                aluno_id: aluno_id
            },
            include: {
                disciplina: {
                    select: {
                        id: true,
                        nome: true,   
                    }
                }
            }
        });
    }

    public async findByDisciplinaId(disciplina_id : string) : Promise<Progresso[]> {
        return prisma.progresso.findMany({
            where: {
                disciplina_id: disciplina_id
            }
        });
    }
}
import { prisma } from "../../lib/prisma";
import type { Disciplina, Modulo } from "../../generated/prisma/client";

export class DisciplinaRepository {
    public async findAll() : Promise<Disciplina[]> {
        return prisma.disciplina.findMany();
    }
    public async findById(id : string) : Promise<Disciplina | null> {
        return prisma.disciplina.findUnique({
            where: {
                id: id
            }
        });
    }
    public async create (data : Omit<Disciplina, "id">) : Promise<Disciplina> {
        return prisma.disciplina.create({
            data
        });
    }
    public async update (id: string, data : Partial<Omit<Disciplina, "id">>) : Promise<Disciplina | null> {
        return prisma.disciplina.update({
            where: {
                id: id
            },
            data
        })
    }
    public async delete (id : string) : Promise<Disciplina | null> {
        return prisma.disciplina.delete({
            where: {
                id: id
            }
        })
    }

    public async countAulas (id : string) : Promise<Number> {
        return prisma.disciplina.count({
            where: {
                modulos: {
                    
                }
            }
        })
    }

    public async buscaModulos (disciplina_id : string) : Promise<Modulo[]> {
        return prisma.modulo.findMany({
            where: {
                disciplina_id: disciplina_id
            }
        })
    }
}
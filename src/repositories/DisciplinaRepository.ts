import { prisma } from "../../lib/prisma";
import type { Disciplina } from "../../generated/prisma/client";

export class DisciplinaRepositoy {
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
}
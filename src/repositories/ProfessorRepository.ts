import { prisma } from "../../lib/prisma";
import type { Professor } from '../../generated/prisma/client'

export class professorRepository {
    
    public async findAll() : Promise<Professor[]> {
        return prisma.professor.findMany();
    }

    public async findById(id : string) : Promise<Professor | null> {
        return prisma.professor.findUnique({
            where: {
                id: id
            }
        });
    }

    public async create(data : Omit<Professor, 'id'>) : Promise<Professor> {
        return prisma.professor.create({
            data
        });
    }

    public async update(id : string, data : Partial<Omit<Professor, 'id' | 'senha'>>) : Promise<Professor> {
        return prisma.professor.update({
            where: {
                id: id
            },
            data
        });
    }

    public async delete(id : string) : Promise<Professor> {
        return prisma.professor.delete({
            where: {
                id: id
            }
        });
    }
}
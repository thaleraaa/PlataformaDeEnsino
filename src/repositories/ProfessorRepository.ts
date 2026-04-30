import { prisma } from "../../lib/prisma";
import type { Professor } from '../../generated/prisma/client'

export class professorRepository {
    
    public async findAll() : Promise<Professor[]> {
        return prisma.professor.findMany({
            include: {
                conta: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                        role: true
                    }
                }
            }
        });
    }

    public async findById(id : string) : Promise<Professor | null> {
        return prisma.professor.findUnique({
            where: {
                id: id
            },
            include: {
                conta: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                        role: true
                    }
                }
            }
        });
    }

    public async create(data : Omit<Professor, 'id' | "created_at" | "updated_at">) : Promise<Professor> {
        return prisma.professor.create({
            data,
            include: {
                conta: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                        role: true
                    }
                }
            }
        });
    }

    public async update(id : string, data : Partial<Omit<Professor, 'id' | 'senha'>>) : Promise<Professor> {
        return prisma.professor.update({
            where: {
                id: id
            },
            data,
            include: {
                conta: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                        role: true
                    }
                }
            }
        });
    }

    public async delete(id : string) : Promise<Professor> {
        return prisma.professor.delete({
            where: {
                id: id
            },
            include: {
                conta: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                        role: true
                    }
                }
            }
        });
    }
}
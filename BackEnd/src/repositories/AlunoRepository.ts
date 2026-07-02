import {prisma} from '../../lib/prisma.js'
import type { Aluno, Prisma } from '../../generated/prisma/client.js'

export class AlunoRepository {

    public async findAll() : Promise<Aluno[]> {
        return prisma.aluno.findMany({
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


    public async findById(id: string) : Promise<Aluno | null> {
        return prisma.aluno.findUnique({
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

    public async create(
        data: Omit<Aluno, 'id' | "created_at" | "updated_at">) : Promise<Aluno> {
        return prisma.aluno.create({
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
        })
    }

    public async update(id : string, data: Partial<Pick<Aluno, 'periodo' | 'faculdade'>>) : Promise<Aluno> {
        return prisma.aluno.update({
            where: {
                id: id
            }, 
            data
        })
    }

    public async delete(id: string) : Promise<Aluno> {
        return prisma.aluno.delete({
            where: {
                id: id
            }
        })
    }

}
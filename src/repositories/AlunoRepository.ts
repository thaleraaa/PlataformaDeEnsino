import {prisma} from '../../lib/prisma.js'
import type { Aluno } from '../../generated/prisma/client.js'

export class AlunoRepository {

    public async findAll() : Promise<Aluno[]> {
        return prisma.aluno.findMany();
    }


    public async findById(id: string) : Promise<Aluno | null> {
        return prisma.aluno.findUnique({
            where: {
                id: id
            }
        });
    }

    public async create(data: Omit<Aluno, 'id'>) : Promise<Aluno> {
        return prisma.aluno.create({data})
    }

    public async update(id : string, data: Partial<Omit<Aluno, 'id' | 'senha'>>) : Promise<Aluno> {
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
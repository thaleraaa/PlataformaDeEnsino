import type { Alternativa, Exercicio } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

export class ExercicioRepository {

    public async findAll() : Promise<Exercicio[]> {
        return prisma.exercicio.findMany();
    }

    public async findById(id : string) : Promise<Exercicio | null> {
        return prisma.exercicio.findUnique({
            where: {
                id: id
            }
        });
    }

    public async create(data : Omit<Exercicio, 'id'>) : Promise<Exercicio> {
        return prisma.exercicio.create({data});
    }

    public async update(id : string, data : Partial<Omit<Exercicio, 'id' | 'professor_id'>>) : Promise<Exercicio> {
        return prisma.exercicio.update({
            where: {
                id: id
            },
            data
        });
    }

    public async delete(id : string) : Promise<Exercicio> {
        return prisma.exercicio.delete({
            where: {
                id: id
            }
        });
    }

    public async findAlternativaByExercicioID(exercicio_id : string) : Promise<Alternativa[]> {
        return prisma.alternativa.findMany({
            where: {
                exercicio_id: exercicio_id
            }
        })
    }
}

import type { Aula } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

export class AulaRepository {

    public async findAll() : Promise<Aula[] > {
        return prisma.aula.findMany();
    }

    public async findById(id : string) : Promise<Aula | null> {
        return prisma.aula.findUnique({
            where: {
                id: id
            }
        });
    }

    public async create(data : Omit<Aula, 'id'>) : Promise<Aula> {
        return prisma.aula.create({data});
    }

    public async update(id : string, data : Partial<Omit<Aula, 'id'>>) : Promise<Aula> {
        return prisma.aula.update({
            where: {
                id: id
            },
            data
        });
    }

    public async delete(id : string) : Promise<Aula> {
        return prisma.aula.delete({
            where: {
                id: id
            }
        });
    }
}

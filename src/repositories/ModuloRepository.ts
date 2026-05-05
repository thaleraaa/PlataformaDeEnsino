import { prisma } from "../../lib/prisma";
import type { Aula, Modulo } from "../../generated/prisma/client";

export class ModuloRepository {

    public async create (data : Omit<Modulo, 'id'>) : Promise<Modulo> {
        return prisma.modulo.create({
            data
        });
    }

    public async get () : Promise<Modulo[]> {
        return prisma.modulo.findMany();
    }

    public async getParamId (id : string) : Promise<Modulo | null> {
        return prisma.modulo.findUnique({
            where: {
                id: id
            }
        });
    } 

    public async update (id: string, data : Partial<Omit<Modulo,"id">>) : Promise<Modulo> {
        return prisma.modulo.update({
            where: {
                id: id
            },
            data
        });
    }

    public async delete (id: string) : Promise<Modulo> {
        return prisma.modulo.delete({
            where: {
                id: id
            }
        });
    }

    public async buscaAulas (modulo_id: string) : Promise<Aula[]> {
        return prisma.aula.findMany({
            where: {
                modulo_id
            }
        });
    }

}
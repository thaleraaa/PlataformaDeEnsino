import type { Simulado } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

export class SimuladoRepository {
    public async findAll() : Promise<Simulado[]> {
        return prisma.simulado.findMany();
    }

    public async findById(id: string) : Promise <Simulado | null> {
        return prisma.simulado.findUnique({
            where: {
                id: id
            }
        });
    }

    public async create(data: Omit<Simulado, 'id'>) : Promise<Simulado> {
        return prisma.simulado.create({data});
    }

    public async update(id: string, data : Partial<Omit<Simulado, "id">>) : Promise<Simulado> {
        return prisma.simulado.update({
            where: {
                id: id
            },
            data
        })
    }

    public async delete(id : string) : Promise<Simulado> {
        return prisma.simulado.delete({
            where: {
                id: id
            }
        })
    }
}
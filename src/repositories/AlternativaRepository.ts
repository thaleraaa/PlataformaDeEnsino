import type { Alternativa } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

export class AlternativaRepository {
    public async findAll() : Promise<Alternativa []> {
        return prisma.alternativa.findMany();
    }

    public async findById(id : string) : Promise<Alternativa | null> {
        return prisma.alternativa.findUnique({
            where: {
                id: id
            }
        });
    }

    public async create (data : Omit<Alternativa, "id">) : Promise<Alternativa> {
        return prisma.alternativa.create({
            data
        });
    }

    public async update (id : string, data : Partial<Omit<Alternativa, "id">>) : Promise<Alternativa> {
        return prisma.alternativa.update({
            where: {
                id: id
            },
            data
        });
    }

    public async delete (id : string) : Promise<Alternativa> {
        return prisma.alternativa.delete({
            where: {
                id: id
            }
        });
    }
}

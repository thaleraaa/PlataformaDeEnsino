import { prisma } from "../../lib/prisma";
import type { Administrador } from "../../generated/prisma/client";

export class AdministradorRepository {

    public async findAll() : Promise<Omit<Administrador, "senha">[]> {
        return prisma.administrador.findMany({
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

    public async findById(id : string) : Promise<Omit<Administrador, "senha"> | null> {
        return prisma.administrador.findUnique({
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
        data : Omit<Administrador, "id" | "created_at" | "updated_at">
    ) : Promise<Omit<Administrador, "senha">> {
        return prisma.administrador.create({
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

    public async update (id: string, data : Partial<Pick<Administrador, 'ativo'>>) : Promise<Omit<Administrador, "senha">> {
        return prisma.administrador.update({
            where: {
                id: id
            },
            data,
        });
    }

    public async delete (id: string) : Promise<Omit<Administrador, "senha">> {
        return prisma.administrador.delete({
            where: {
                id: id
            }
        });
    }

}
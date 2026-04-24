import { prisma } from "../../lib/prisma";
import type { Administrador } from "../../generated/prisma/client";

export class AdministradorRepository {

    public async findAll() : Promise<Omit<Administrador, "senha">[]> {
        return prisma.administrador.findMany({
            omit: {
                senha: true
            }
        });
    }

    public async findById(id : string) : Promise<Omit<Administrador, "senha"> | null> {
        return prisma.administrador.findUnique({
            where: {
                id: id
            },
            omit: {
                senha: true
            }
        });
    }

    public async create(data : Omit<Administrador, 'id'>) : Promise<Omit<Administrador, "senha">> {
        return prisma.administrador.create({
            data,
            omit: {
                senha: true
            }
        });
    }

    public async update (id: string, data : Partial<Omit<Administrador, 'id'>>) : Promise<Omit<Administrador, "senha">> {
        return prisma.administrador.update({
            where: {
                id: id
            },
            data,
            omit: {
                senha: true
            }
        });
    }

    public async delete (id: string) : Promise<Omit<Administrador, "senha">> {
        return prisma.administrador.delete({
            where: {
                id: id
            },
            omit: {
                senha: true
            }
        });
    }

}
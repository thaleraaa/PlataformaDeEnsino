import type { Conta } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

export class ContaRepository {
    public async create(data: Omit<Conta, 'id'>) : Promise <Conta> {
        return prisma.conta.create({data});
    }

    public async findByEmail(email : string) : Promise <Conta | null> {
        return prisma.conta.findFirst({
            where: {
                email: email
            }
        });
    }

    public async update(
        conta_id: string,
        data: Pick<Conta, 'nome' | 'email'>
    ) : Promise <Conta> {
        return prisma.conta.update({
            where: {
                id: conta_id
            },
            data
        });
    }
}
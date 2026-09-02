import type { Conta } from "../../generated/prisma/client";
import type { FastifyRequest, FastifyReply } from "fastify";
import { ContaRepository } from "../repositories/ContaRepository";

export class ContaController {
    private contaRepository = new ContaRepository();

    update = async(
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        const conta_id = (request as any).user?.conta_id;
        const data = request.body as Pick<Conta, 'email' | 'nome'>
        if(!conta_id) {
            return reply.status(401).send({message: "Não autorizado"});
        }
        const userMudado = await this.contaRepository.update(conta_id, data);
        return reply.status(200).send(userMudado);
    }

}

export const contaController = new ContaController();
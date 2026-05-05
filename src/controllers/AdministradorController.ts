import type { FastifyRequest, FastifyReply } from "fastify";
import { AdministradorRepository } from "../repositories/AdministradorRepository";
import type { Administrador, Conta } from "../../generated/prisma/client";
import { hash } from "argon2";
import { ContaRepository } from "../repositories/ContaRepository";

export class AdministradorController {
    private administradorRepository = new AdministradorRepository();
    private contaRepository = new ContaRepository();

    get = async (
        request : FastifyRequest,
        reply : FastifyReply
    ) : Promise<Omit<Administrador, 'senha'>[] | null> => {
        
        const administrador = await this.administradorRepository.findAll();
        return reply.status(200).send(administrador);
    }

    getParamId = async (
        request : FastifyRequest,
        reply : FastifyReply
    ) => {
        const { id } = request.params as { id: string };
        const adm = await this.administradorRepository.findById(id);
        return reply.status(200).send(adm);
    }

    getDetail = async (
        request : FastifyRequest,
        reply : FastifyReply
    ) => {
        const id = (request as any).user?.id;
        const adm = await this.administradorRepository.findById(id);
        return reply.status(200).send(adm);
    }

    create = async (
        request : FastifyRequest,
        reply : FastifyReply
    ) => {
        const adm = request.body as Pick<Administrador, "ativo">;
        const conta = request.body as Pick<Conta, "nome" | "email" | "senha">;

        if (!conta.senha) {
            return reply.status(400).send({ message: "A senha e necessaria." });
        }

        const senhaHash = await hash(conta.senha);
        const contaNova = await this.contaRepository.create({
            email: conta.email,
            nome: conta.nome,
            role: "ADMINISTRADOR",
            senha: senhaHash
        });

        const novoADM = await this.administradorRepository.create({
            ativo: adm.ativo,
            conta_id: contaNova.id
        });
        return reply.status(201).send(novoADM);
    }

    delete = async (
        request : FastifyRequest,
        reply : FastifyReply
    ) => {
        const { id } = request.params as { id: string };
        const adm = await this.administradorRepository.delete(id);
        return reply.status(200).send(adm);
    }

    update = async (
        request : FastifyRequest,
        reply : FastifyReply
    ) => {
        const adm = request.body as Partial<Omit<Administrador, 'id' | 'senha'>>;

        const id  = (request as any).user?.id;
        if(!id) {
            return reply.status(401).send({message: "Não autorizado"});
        }
        const admEditado = await this.administradorRepository.update(id, adm);
        return reply.status(200).send(admEditado);
    }

}

export const administradorController = new AdministradorController();
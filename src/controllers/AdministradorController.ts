import type { FastifyRequest, FastifyReply } from "fastify";
import { AdministradorRepository } from "../repositories/AdministradorRepository";
import type { Administrador } from "../../generated/prisma/client";

export class AdministradorController {
    private administradorRepository = new AdministradorRepository();

    get = async (
        request : FastifyRequest,
        reply : FastifyReply
    ) : Promise<Omit<Administrador, 'senha'>[] | null> => {
        
        const administrador = await this.administradorRepository.findAll();
        return reply.status(200).send(administrador);
    }

    getParamId = async (
        request : FastifyRequest<{Params: {id : string}}>,
        reply : FastifyReply
    ) => {
        const {id} = request.params;
        const adm = await this.administradorRepository.findById(id);
        return reply.status(200).send(adm);
    }

    create = async (
        request : FastifyRequest<{Body: Omit<Administrador,'id'>}>,
        reply : FastifyReply
    ) => {
        const adm = request.body;
        const novoADM = await this.administradorRepository.create(adm);
        return reply.status(201).send(novoADM);
    }

    delete = async (
        request : FastifyRequest<{Params: {id : string}}>,
        reply : FastifyReply
    ) => {
        const { id } = request.params;
        const adm = await this.administradorRepository.delete(id);
        return reply.status(200).send(adm);
    }

    update = async (
        request : FastifyRequest<{Params: {id : string}, Body: Partial<Omit<Administrador, 'id' | 'senha'>>}>,
        reply : FastifyReply
    ) => {
        const adm = request.body;
        const { id } = request.params;
        const admEditado = await this.administradorRepository.update(id, adm);
        return reply.status(200).send(admEditado);
    }

}

export const administradorController = new AdministradorController();
import type { FastifyRequest, FastifyReply } from "fastify";
import type { Simulado } from "../../generated/prisma/client";
import { SimuladoRepository } from "../repositories/SimuladoRepository";

export class SimuladoController {
    private simuladoRepository = new SimuladoRepository();

    get = async(
       request : FastifyRequest,
       reply : FastifyReply 
    ) => {
        const todosSimulados = await this.simuladoRepository.findAll();
        return reply.status(200).send(todosSimulados);
    }

    getParamId = async (
        request : FastifyRequest<{Params: {id : string}}>,
        reply : FastifyReply
    ) => {
        const {id} = request.params;
        const simulado = await this.simuladoRepository.findById(id);
        return reply.status(200).send(simulado);
    }

    create = async (
        request: FastifyRequest<{Body: Omit<Simulado, 'id'>}>,
        reply : FastifyReply
    ) => {
        const simulado = request.body;
        const novoSimulado = await this.simuladoRepository.create(simulado);
        return reply.status(201).send(novoSimulado);
    }

    update = async (
        request: FastifyRequest<{Body: Partial<Omit<Simulado, "id">>, Params: {id : string}}>,
        reply : FastifyReply
    ) => {
        const simulado = request.body;
        const {id} = request.params;
        const simuladoEditado = await this.simuladoRepository.update(id, simulado);
        return reply.status(200).send(simuladoEditado);
    }

    delete = async (
        request : FastifyRequest<{Params: {id: string}}>,
        reply : FastifyReply
    ) => {
        const {id} = request.params;
        const simuladoDeletado = await this.simuladoRepository.delete(id);
        return reply.status(200).send(simuladoDeletado);
    }

}

export const simuladoController = new SimuladoController();
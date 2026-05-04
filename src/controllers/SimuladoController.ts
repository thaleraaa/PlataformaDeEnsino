import type { FastifyRequest, FastifyReply } from "fastify";
import type { Simulado } from "../../generated/prisma/client";
import { SimuladoRepository } from "../repositories/SImuladoRepository";

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
        request : FastifyRequest,
        reply : FastifyReply
    ) => {
        const { id } = request.params as { id: string };
        const simulado = await this.simuladoRepository.findById(id);
        return reply.status(200).send(simulado);
    }

    create = async (
        request: FastifyRequest,
        reply : FastifyReply
    ) => {
        const simulado = request.body as Omit<Simulado, 'id'>;
        const novoSimulado = await this.simuladoRepository.create(simulado);
        return reply.status(201).send(novoSimulado);
    }

    update = async (
        request: FastifyRequest,
        reply : FastifyReply
    ) => {
        const simulado = request.body as Partial<Omit<Simulado, "id">>;
        const { id } = request.params as { id: string };
        const simuladoEditado = await this.simuladoRepository.update(id, simulado);
        return reply.status(200).send(simuladoEditado);
    }

    delete = async (
        request : FastifyRequest,
        reply : FastifyReply
    ) => {
        const { id } = request.params as { id: string };
        const simuladoDeletado = await this.simuladoRepository.delete(id);
        return reply.status(200).send(simuladoDeletado);
    }

}

export const simuladoController = new SimuladoController();
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
        const { simulado_id } = request.params as { simulado_id: string };
        const simulado = await this.simuladoRepository.findById(simulado_id);
        return reply.status(200).send(simulado);
    }

    create = async (
        request: FastifyRequest,
        reply : FastifyReply
    ) => {
        const simulado = request.body as Omit<Simulado, 'id'>;
        const professor_id = (request as any).user?.id;
        if(!professor_id) {
            return reply.status(401).send({message: "Não autorizado"});
        }
        const novoSimulado = await this.simuladoRepository.create({...simulado, professor_id: professor_id});
        return reply.status(201).send(novoSimulado);
    }

    update = async (
        request: FastifyRequest,
        reply : FastifyReply
    ) => {
        const simulado = request.body as Partial<Omit<Simulado, "id" | "professor_id">>;
        const { simulado_id } = request.params as { simulado_id: string };
        const simuladoEditado = await this.simuladoRepository.update(simulado_id, simulado);
        return reply.status(200).send(simuladoEditado);
    }

    delete = async (
        request : FastifyRequest,
        reply : FastifyReply
    ) => {
        const { simulado_id } = request.params as { simulado_id: string };
        const simuladoDeletado = await this.simuladoRepository.delete(simulado_id);
        return reply.status(200).send(simuladoDeletado);
    }

    getParamExercicio = async (
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        const { simulado_id } = request.params as { simulado_id: string };
        const exercicios = await this.simuladoRepository.findByExercicioBySimulado(simulado_id);
        return reply.status(200).send(exercicios);
    }

}

export const simuladoController = new SimuladoController();
import type { FastifyRequest, FastifyReply } from 'fastify';
import { ResultadoRepository } from '../repositories/ResultadoRepository.js';
import type { Resultado } from '../../generated/prisma/client.js';

export class ResultadoController {
    private resultadoRepository = new ResultadoRepository();

    get = async (
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        const resultados = await this.resultadoRepository.findAll();
        return reply.status(200).send(resultados);
    };

    getParamId = async (
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) => {
        const { id } = request.params;
        const resultado = await this.resultadoRepository.findById(id);
        return reply.status(200).send(resultado);
    };

    getByAlunoAndSimulado = async (
        request: FastifyRequest<{ Params: { aluno_id: string; simulado_id: string } }>,
        reply: FastifyReply
    ) => {
        const { aluno_id, simulado_id } = request.params;
        const resultado = await this.resultadoRepository.findByAlunoAndSimulado(aluno_id, simulado_id);
        return reply.status(200).send(resultado);
    };

    getByAluno = async (
        request: FastifyRequest<{ Params: { aluno_id: string } }>,
        reply: FastifyReply
    ) => {
        const { aluno_id } = request.params;
        const resultados = await this.resultadoRepository.findByAluno(aluno_id);
        return reply.status(200).send(resultados);
    };

    getBySimulado = async (
        request: FastifyRequest<{ Params: { simulado_id: string } }>,
        reply: FastifyReply
    ) => {
        const { simulado_id } = request.params;
        const resultados = await this.resultadoRepository.findBySimulado(simulado_id);
        return reply.status(200).send(resultados);
    };

    create = async (
        request: FastifyRequest<{ Body: Omit<Resultado, 'id' | 'created_at' | 'updated_at'> }>,
        reply: FastifyReply
    ) => {
        const resultado = request.body;
        const novoResultado = await this.resultadoRepository.create(resultado);
        return reply.status(201).send(novoResultado);
    };

    update = async (
        request: FastifyRequest<{
            Params: { id: string };
            Body: Partial<Omit<Resultado, 'id' | 'created_at' | 'updated_at' | 'aluno_id' | 'simulado_id'>>;
        }>,
        reply: FastifyReply
    ) => {
        const { id } = request.params;
        const resultado = request.body;
        const resultadoEditado = await this.resultadoRepository.update(id, resultado);
        return reply.status(200).send(resultadoEditado);
    };

    delete = async (
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) => {
        const { id } = request.params;
        const resultadoDeletado = await this.resultadoRepository.delete(id);
        return reply.status(200).send(resultadoDeletado);
    };
}

export const resultadoController = new ResultadoController();

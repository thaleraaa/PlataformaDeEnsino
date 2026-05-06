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
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        const { resultado_id } = request.params as { resultado_id: string };
        const resultado = await this.resultadoRepository.findById(resultado_id);
        return reply.status(200).send(resultado);
    };

    getDetail = async (
        request : FastifyRequest,
        reply : FastifyReply
    ) => {
        const aluno_id = (request as any).user?.id;
        if(!aluno_id) {
            return reply.status(401).send({message: "Não autorizado"});
        }
        const detailAluno = await this.resultadoRepository.findByAluno(aluno_id);
        return reply.status(200).send(detailAluno);
    }

    getByAlunoAndSimulado = async (
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        const { aluno_id, simulado_id } = request.params as { aluno_id: string; simulado_id: string };
        const resultado = await this.resultadoRepository.findByAlunoAndSimulado(aluno_id, simulado_id);
        return reply.status(200).send(resultado);
    };

    getByAluno = async (
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        const { aluno_id } = request.params as { aluno_id: string };
        const resultados = await this.resultadoRepository.findByAluno(aluno_id);
        return reply.status(200).send(resultados);
    };

    getBySimulado = async (
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        const { simulado_id } = request.params as { simulado_id: string };
        const resultados = await this.resultadoRepository.findBySimulado(simulado_id);
        return reply.status(200).send(resultados);
    };

    create = async (
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        const resultado = request.body as Omit<Resultado, 'id' | 'created_at' | 'updated_at'>;
        const novoResultado = await this.resultadoRepository.create(resultado);
        return reply.status(201).send(novoResultado);
    };

    update = async (
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        const { resultado_id } = request.params as { resultado_id: string };
        const resultado = request.body as Partial<
            Omit<Resultado, 'id' | 'created_at' | 'updated_at' | 'aluno_id' | 'simulado_id'>
        >;
        const resultadoEditado = await this.resultadoRepository.update(resultado_id, resultado);
        return reply.status(200).send(resultadoEditado);
    };

    delete = async (
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        const { resultado_id } = request.params as { resultado_id: string };
        const resultadoDeletado = await this.resultadoRepository.delete(resultado_id);
        return reply.status(200).send(resultadoDeletado);
    };
}

export const resultadoController = new ResultadoController();

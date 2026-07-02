import type { FastifyRequest, FastifyReply } from "fastify";
import type { Simulado } from "../../generated/prisma/client";
import { SimuladoRepository } from "../repositories/SImuladoRepository";
import { ResultadoRepository } from "../repositories/ResultadoRepository";

export class SimuladoController {
    private simuladoRepository = new SimuladoRepository();
    private resultadoRepository = new ResultadoRepository();

    get = async (request: FastifyRequest, reply: FastifyReply) => {
        const todosSimulados = await this.simuladoRepository.findAll();
        return reply.status(200).send(todosSimulados);
    }

    getParamId = async (request: FastifyRequest, reply: FastifyReply) => {
        const { simulado_id } = request.params as { simulado_id: string };
        const simulado = await this.simuladoRepository.findById(simulado_id);
        return reply.status(200).send(simulado);
    }

    create = async (request: FastifyRequest, reply: FastifyReply) => {
        const simulado = request.body as Omit<Simulado, 'id'>;
        const professor_id = (request as any).user?.id;
        if (!professor_id) return reply.status(401).send({ message: "Não autorizado" });
        const novoSimulado = await this.simuladoRepository.create({ ...simulado, professor_id });
        return reply.status(201).send(novoSimulado);
    }

    update = async (request: FastifyRequest, reply: FastifyReply) => {
        const simulado = request.body as Partial<Omit<Simulado, "id" | "professor_id">>;
        const { simulado_id } = request.params as { simulado_id: string };
        const simuladoEditado = await this.simuladoRepository.update(simulado_id, simulado);
        return reply.status(200).send(simuladoEditado);
    }

    delete = async (request: FastifyRequest, reply: FastifyReply) => {
        const { simulado_id } = request.params as { simulado_id: string };
        const simuladoDeletado = await this.simuladoRepository.delete(simulado_id);
        return reply.status(200).send(simuladoDeletado);
    }

    getParamExercicio = async (request: FastifyRequest, reply: FastifyReply) => {
        const { simulado_id } = request.params as { simulado_id: string };
        const exercicios = await this.simuladoRepository.findByExercicioBySimulado(simulado_id);
        return reply.status(200).send(exercicios);
    }

    corrigir = async (request: FastifyRequest, reply: FastifyReply) => {
        const aluno_id = (request as any).user?.id;
        if (!aluno_id) return reply.status(401).send({ message: "Não autorizado" });

        const { simulado_id } = request.params as { simulado_id: string };
        const { respostas, tempoSegundos } = request.body as {
            respostas: { exercicio_id: string; alternativa_id: string | null }[];
            tempoSegundos: number;
        };

        const exercicios = await this.simuladoRepository.findExerciciosComCorreta(simulado_id);

        let acertos = 0;
        for (const ex of exercicios) {
            const respostaAluno = respostas.find(r => r.exercicio_id === ex.id);
            const alternativaCorreta = ex.alternativa[0];
            if (respostaAluno?.alternativa_id && alternativaCorreta && respostaAluno.alternativa_id === alternativaCorreta.id) {
                acertos++;
            }
        }

        const total = exercicios.length;
        const nota = total > 0 ? parseFloat(((acertos / total) * 10).toFixed(2)) : 0;

        const resultado = await this.resultadoRepository.create({
            nota,
            tempoSegundos,
            simulado_id,
            aluno_id,
            dataRealizacao: new Date(),
        });

        return reply.status(201).send({ acertos, total, nota, resultado });
    }
}

export const simuladoController = new SimuladoController();
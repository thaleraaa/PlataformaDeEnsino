import type { FastifyRequest, FastifyReply } from "fastify";
import { AlunoRepository } from "../repositories/AlunoRepository";
import type { Aluno, Conta } from "../../generated/prisma/client.js";
import { hash } from 'argon2';
import { ContaRepository } from "../repositories/ContaRepository";
import { prisma } from "../../lib/prisma.js";

export class AlunoController {
    private alunoRepository = new AlunoRepository();
    private contaRepository = new ContaRepository();

    create = async (
        request: FastifyRequest,
        reply: FastifyReply,
    ) => {
        const aluno = request.body as Pick<Aluno, "periodo" | "faculdade">;
        const conta = request.body as Pick<Conta, "nome" | "email" | "senha">;

        if(!conta.senha) {
            return reply.status(400).send({message: "A senha é necessaria."});
        }
        const senhaHash = await hash(conta.senha);

        const contaNova = await prisma.conta.create({
            data: {
                email: conta.email,
                nome: conta.nome,
                role: 'ALUNO',
                senha: senhaHash,
                aluno: {
                    create: {
                        periodo: aluno.periodo,
                        faculdade: aluno.faculdade
                    }
                }
            },
            include: {
                aluno: {
                    include: {
                        conta: {
                            select: {
                                id: true,
                                nome: true,
                                email: true,
                                role: true
                            }
                        }
                    }
                }
            }
        });

        return reply.status(201).send(contaNova.aluno);
    };

    get = async (
        request: FastifyRequest, 
        reply: FastifyReply
    ) => {
        const alunosRetornados = await this.alunoRepository.findAll();
        return reply.status(200).send(alunosRetornados);
    }

    getParamId = async (
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        const id  = (request as any).user?.id;
        if(!id) {
            return reply.status(401).send({message: "Não autorizado"});
        }
        const aluno = await this.alunoRepository.findById(id);
        return reply.status(200).send(aluno);
    }

    delete = async (
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        const id  = (request as any).user?.id;
        if(!id) {
            return reply.status(401).send({message: "Não autorizado"});
        }        
        const aluno = await this.alunoRepository.delete(id);
        return reply.status(200).send(aluno);
    }

    update = async (
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        const aluno = request.body as Partial<Omit<Aluno, 'id' | 'senha'>>;
        const id  = (request as any).user?.id;
        if(!id) {
            return reply.status(401).send({message: "Não autorizado"});
        }
        const alunoEditado = await this.alunoRepository.update(id, aluno);
        return reply.status(200).send(alunoEditado);
    }
}

export const alunoController = new AlunoController();
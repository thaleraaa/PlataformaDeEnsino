import type { FastifyRequest, FastifyReply } from "fastify";
import { professorRepository } from "../repositories/ProfessorRepository";
import type { Professor, Conta } from "../../generated/prisma/client.js";
import { hash } from "argon2";
import { prisma } from "../../lib/prisma.js";

export class ProfessorController {
	private professorRepository = new professorRepository();

	create = async (
		request: FastifyRequest,
		reply: FastifyReply,
	) => {
		const professor = request.body as Pick<Professor, "CRM" | "salario">;
		const conta = request.body as Pick<Conta, "nome" | "email" | "senha">;

		if (!conta.senha) {
			return reply.status(400).send({ message: "A senha e necessaria." });
		}

		const adm_id = (request as any).user?.id;
		if (!adm_id) {
			return reply.status(401).send({ message: "Nao autenticado" });
		}

		const senhaHash = await hash(conta.senha);
		const contaNova = await prisma.conta.create({
			data: {
				email: conta.email,
				nome: conta.nome,
				role: "PROFESSOR",
				senha: senhaHash,
				professor: {
					create: {
						CRM: professor.CRM,
						salario: professor.salario,
						adm_id: adm_id
					}
				}
			},
			include: {
				professor: {
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

		return reply.status(201).send(contaNova.professor);
	};

	get = async (
		request: FastifyRequest,
		reply: FastifyReply,
	) => {
		const professoresRetornados = await this.professorRepository.findAll();
		return reply.status(200).send(professoresRetornados);
	};

	getParamId = async (
		request: FastifyRequest,
		reply: FastifyReply,
	) => {
		const { id } = request.params as { id: string };
		const professor = await this.professorRepository.findById(id);
		return reply.status(200).send(professor);
	};

	delete = async (
		request: FastifyRequest,
		reply: FastifyReply,
	) => {
		const professor_id = (request as any).user?.id;
		if(!professor_id) {
			return reply.status(401).send({message: "Não autorizado"});
		}		const professor = await this.professorRepository.delete(professor_id);
		return reply.status(200).send(professor);
	};

	update = async (
		request: FastifyRequest,
		reply: FastifyReply,
	) => {
		const professor = request.body as Partial<Pick<Professor, 'CRM' | 'salario'>>;
		const professor_id = (request as any).user?.id;
		if(!professor_id) {
			return reply.status(401).send({message: "Não autorizado"});
		}
		const professorEditado = await this.professorRepository.update(professor_id, professor);
		return reply.status(200).send(professorEditado);
	};

	getMe = async (
		request: FastifyRequest,
		reply: FastifyReply
	) => {
		const professor_id = (request as any).user?.id;
		if(!professor_id) {
			return reply.status(401).send({message: "Não autorizado"});
		}
		const professorDetail = await this.professorRepository.findById(professor_id);
		return reply.status(200).send(professorDetail);
	}
}

export const professorController = new ProfessorController();

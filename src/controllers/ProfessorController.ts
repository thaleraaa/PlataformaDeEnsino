import type { FastifyRequest, FastifyReply } from "fastify";
import { professorRepository } from "../repositories/ProfessorRepository";
import type { Professor, Conta } from "../../generated/prisma/client.js";
import { hash } from "argon2";
import { ContaRepository } from "../repositories/ContaRepository";

export class ProfessorController {
	private professorRepository = new professorRepository();
	private contaRepository = new ContaRepository();

	create = async (
		request: FastifyRequest,
		reply: FastifyReply,
	) => {
		const professor = request.body as Pick<Professor, "CRM" | "salario" | "adm_id">;
		const conta = request.body as Pick<Conta, "nome" | "email" | "senha">;

		if (!conta.senha) {
			return reply.status(400).send({ message: "A senha e necessaria." });
		}

		const senhaHash = await hash(conta.senha);
		const contaNova = await this.contaRepository.create({
			email: conta.email,
			nome: conta.nome,
			role: "PROFESSOR",
			senha: senhaHash
		});

		const novoProfessor = await this.professorRepository.create({
			CRM: professor.CRM,
			salario: professor.salario,
			adm_id: professor.adm_id,
			conta_id: contaNova.id
		});

		return reply.status(201).send(novoProfessor);
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
		const { id } = request.params as { id: string };
		const professor = await this.professorRepository.delete(id);
		return reply.status(200).send(professor);
	};

	update = async (
		request: FastifyRequest,
		reply: FastifyReply,
	) => {
		const professor = request.body as Partial<Omit<Professor, 'id' | 'senha'>>;
		const { id } = request.params as { id: string };
		const professorEditado = await this.professorRepository.update(id, professor);
		return reply.status(200).send(professorEditado);
	};
}

export const professorController = new ProfessorController();

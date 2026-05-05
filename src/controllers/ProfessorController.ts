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
		const professor = request.body as Omit<Professor, "id" | "conta_id">;
		const conta = request.body as Omit<Conta, "id" | "role">;

		if (!conta.senha) {
			return reply.status(400).send({ message: "A senha e necessaria." });
		}

		const senhaHash = await hash(conta.senha);
		const contaNova = await this.contaRepository.create({
			...conta,
			senha: senhaHash,
			role: "PROFESSOR"
		});

		const adm_id = (request as any).user?.id;

		if (!adm_id) {
			return reply.status(401).send({ message: "Nao autenticado" });
		}

		const novoProfessor = await this.professorRepository.create({
			...professor,
			adm_id: adm_id,
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
		const professor = request.body as Partial<Omit<Professor, 'id' | 'senha' | 'adm_id'>>;
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

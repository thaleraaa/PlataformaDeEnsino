import type { FastifyRequest, FastifyReply } from "fastify";
import { professorRepository } from "../repositories/ProfessorRepository";
import type { Professor } from "../../generated/prisma/client.js";

export class ProfessorController {
	private professorRepository = new professorRepository();

	create = async (
		request: FastifyRequest<{ Body: Omit<Professor, "id"> }>,
		reply: FastifyReply,
	) => {
		const professor = request.body;
		const novoProfessor = await this.professorRepository.create(professor);

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
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply,
	) => {
		const { id } = request.params;
		const professor = await this.professorRepository.findById(id);
		return reply.status(200).send(professor);
	};

	delete = async (
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply,
	) => {
		const { id } = request.params;
		const professor = await this.professorRepository.delete(id);
		return reply.status(200).send(professor);
	};

	update = async (
		request: FastifyRequest<{ Params: { id: string }, Body: Partial<Omit<Professor, 'id' | 'senha'>> }>,
		reply: FastifyReply,
	) => {
		const professor = request.body;
		const { id } = request.params;
		const professorEditado = await this.professorRepository.update(id, professor);
		return reply.status(200).send(professorEditado);
	};
}

export const professorController = new ProfessorController();

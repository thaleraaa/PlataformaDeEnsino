import type { FastifyRequest, FastifyReply } from "fastify";

export async function isProfessorOrAdministrador(
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> {
    const role = (request as any).user?.role;

    if (role !== "PROFESSOR" && role !== "ADMINISTRADOR") {
        return reply.status(403).send({ message: "Acesso negado" });
    }
}

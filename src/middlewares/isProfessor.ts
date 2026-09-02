import type { FastifyRequest, FastifyReply } from "fastify";

export async function isProfessor(
    request : FastifyRequest,
    reply : FastifyReply
) : Promise<void> {

    const role = (request as any).user?.role;

    if(role !== 'PROFESSOR') {
        return reply.status(403).send({message: 'Acesso negado' });
    }

}
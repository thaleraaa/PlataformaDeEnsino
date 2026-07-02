import type { FastifyRequest, FastifyReply } from "fastify";

export async function isAdministrador(
    request : FastifyRequest,
    reply : FastifyReply
) : Promise<void> {

    const role = (request as any).user?.role;

    if(role !== 'ADMINISTRADOR') {
        return reply.status(403).send({message: 'Acesso negado' });
    }

}
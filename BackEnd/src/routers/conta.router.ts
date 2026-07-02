import type { FastifyInstance } from "fastify";
import { contaController } from "../controllers/ContaController.js"
import { putContaSchema } from "../schemas/conta.schema.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

async function contaRoutes(fastify: FastifyInstance) {
    fastify.put('/me', { ...putContaSchema, preHandler: [authMiddleware] }, contaController.update);
}

export default contaRoutes;

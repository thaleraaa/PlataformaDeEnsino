import type { FastifyInstance } from 'fastify';
import {loginController} from '../controllers/AuthController'
import {getAuthSchema } from '../schemas/auth.schema'

async function authRoutes(fastify: FastifyInstance) {
    fastify.post('/login', getAuthSchema, loginController);
}

export default authRoutes;
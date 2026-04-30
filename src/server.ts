import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import alunosRoutes from './routers/aluno.router.js';
import professoresRoutes from './routers/professor.router.js';
import administradoresRoutes from './routers/administrador.router.js';
import disciplinasRoutes from './routers/disciplina.router.js';
import modulosRoutes from './routers/modulo.router.js';
import aulasRoutes from './routers/aula.router.js';
import exerciciosRoutes from './routers/exercicio.router.js';
import alternativasRoutes from './routers/alternativa.router.js';
import simuladosRoutes from './routers/simulado.router.js';
import resultadosRoutes from './routers/resultado.router.js';
import conclusaoAulaRouters from './routers/conclusaoAula.router.js';
import progressoRouters from './routers/progresso.router.js';
import authRoutes from './routers/auth.router.js';
import { authMiddleware } from './middlewares/auth.middleware.js';

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: '*',
});

await app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'FocoMed API',
      description: 'API REST FocoMed',
      version: '1.0.0',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
});

await app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
});

app.register(authRoutes, { prefix: '/auth' });
app.register(alunosRoutes, { prefix: '/alunos' });
app.register(professoresRoutes, { prefix: '/professores' });
app.register(administradoresRoutes, { prefix: '/administradores' });
app.register(disciplinasRoutes, { prefix: '/disciplinas' });
app.register(modulosRoutes, { prefix: '/modulos' });
app.register(aulasRoutes, { prefix: '/aulas' });
app.register(exerciciosRoutes, { prefix: '/exercicios' });
app.register(alternativasRoutes, { prefix: '/alternativas' });
app.register(simuladosRoutes, { prefix: '/simulados' });
app.register(resultadosRoutes, { prefix: '/resultados' });
app.register(conclusaoAulaRouters, { prefix: '/conclusao' });
app.register(progressoRouters, { prefix: '/progressos' });

const PUBLIC_ROUTES = ['/auth/login', '/docs', '/docs/'];

app.addHook('onRequest', async (request, reply) => {
	if (!request.url) {
		return reply.code(400).send({ error: 'Bad Request' });
	}

	const url = request.url!.split('?')[0] ?? request.url! // ignora query string

  if (PUBLIC_ROUTES.includes(url) || url.startsWith('/docs')) {
		return;
	}

  if (url === ('/alunos/') && request.method === 'POST') {
    return;
  }

  if (url === ('/professores/') && request.method === 'POST') {
    return;
  }

  if (url === ('/administradores/') && request.method === 'POST') {
    return;
  }

	await authMiddleware(request, reply);
});

const start = async () => {
  try {
    await app.listen({ port: 3000 });
    console.log('Server running on http://localhost:3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
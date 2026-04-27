import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
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

const app = Fastify({ logger: true });

await app.register(cors, {
 origin: "*", });

await app.register(fastifySwagger, {
	openapi: {
		info: {
			title: 'FocoMed API',
			description: 'API REST FocoMed',
			version: '1.0.0',
		},
		servers: [{ url: 'http://localhost:3000' }],
	},
});

await app.register(fastifySwaggerUi, {
	routePrefix: '/docs',
})

app.register(alunosRoutes, { prefix: '/alunos' });
app.register(professoresRoutes, { prefix: '/professores'})
app.register(administradoresRoutes, { prefix: '/administradores'});
app.register(disciplinasRoutes, {prefix: '/disciplinas'});
app.register(modulosRoutes, {prefix: '/modulos'});
app.register(aulasRoutes, {prefix: '/aulas'});
app.register(exerciciosRoutes, {prefix: '/exercicios'});
app.register(alternativasRoutes, {prefix: '/alternativas'});
app.register(simuladosRoutes, {prefix: '/simulados'});
app.register(resultadosRoutes, {prefix: '/resultados'});

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
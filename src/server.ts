import Fastify from 'fastify';
import alunosRoutes from './routers/aluno.router.js';
import professoresRoutes from './routers/professor.router.js';
import administradoresRoutes from './routers/administrador.router.js';

const app = Fastify({ logger: true });
app.register(alunosRoutes, { prefix: '/alunos' });
app.register(professoresRoutes, { prefix: '/professores'})
app.register(administradoresRoutes, { prefix: '/administradores'});

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
# FocoMed API

API REST da plataforma de ensino FocoMed. O backend gerencia usuários, conteúdo educacional, simulados, resultados, conclusões de aulas e progresso dos alunos.

## Visão geral

- **Runtime:** Node.js
- **Linguagem:** TypeScript
- **Framework HTTP:** Fastify
- **Banco de dados:** PostgreSQL 15.3
- **ORM:** Prisma 7
- **Autenticação:** JWT Bearer Token
- **Documentação:** OpenAPI 3 + Swagger UI
- **Porta padrão:** `3000`

## Requisitos

- Node.js 20 ou superior
- npm
- Docker Desktop com Docker Compose

## Instalação

```bash
git clone https://github.com/thaleraaa/PlataformaDeEnsino
cd BackEnd
npm install
```

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://admin:admin@localhost:5432/focoMed"
JWT_SECRET="uma-hash-muito-segura"
```

> O host `localhost` é usado quando o backend e os comandos Prisma são executados no Windows. Se o backend também estiver dentro de um container Docker, use `db` como host: `postgresql://admin:admin@db:5432/focoMed`.

## Banco de dados

Suba o PostgreSQL:

```bash
docker compose up -d db
```

Gere o Prisma Client e aplique as migrações:

```bash
npx prisma generate
npx prisma migrate dev
```

Para abrir o Prisma Studio:

```bash
npx prisma studio
```

O banco disponibilizado pelo Compose possui estas credenciais locais:

| Configuração | Valor |
| --- | --- |
| Host | `localhost` |
| Porta | `5432` |
| Banco | `focoMed` |
| Usuário | `admin` |
| Senha | `admin` |

## Executando a API

Modo desenvolvimento, com recarregamento automático:

```bash
npm run dev
```

Quando o servidor estiver em execução:

- API: http://localhost:3000
- Swagger UI: http://localhost:3000/docs

## Autenticação

A maioria dos endpoints exige um token JWT. Primeiro, autentique um usuário:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@email.com","senha":"sua-senha"}'
```

Resposta esperada:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

Use o token nas próximas requisições:

```bash
curl http://localhost:3000/alunos/me \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Perfis de acesso

- `ALUNO`: acesso às próprias informações, conclusões, progresso e correção de simulados.
- `PROFESSOR`: gerenciamento do conteúdo educacional e consulta de resultados/progresso conforme as permissões da rota.
- `ADMINISTRADOR`: gerenciamento administrativo e acesso ampliado a usuários, conteúdo, resultados e progresso.

As permissões indicadas abaixo refletem as regras documentadas pelas rotas. A validação final deve ser conferida no Swagger e nos middlewares da aplicação.

## Endpoints

Todas as rotas abaixo usam o prefixo `http://localhost:3000`. Rotas marcadas com `JWT` exigem o header `Authorization: Bearer <token>`.

### Autenticação

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| `POST` | `/auth/login` | Público | Autentica um usuário e retorna um token JWT |

### Alunos

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| `POST` | `/alunos/` | Público | Cria um aluno |
| `GET` | `/alunos/` | Administrador | Lista todos os alunos |
| `GET` | `/alunos/me` | JWT | Busca o próprio aluno |
| `PUT` | `/alunos/` | JWT | Atualiza os dados do próprio aluno |
| `DELETE` | `/alunos/` | JWT | Deleta o próprio aluno |

### Professores

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| `POST` | `/professores/` | Administrador | Cria um professor |
| `GET` | `/professores/` | Administrador | Lista todos os professores |
| `GET` | `/professores/me` | Professor | Busca o próprio professor |
| `GET` | `/professores/{professor_id}` | Administrador | Busca professor por ID |
| `PUT` | `/professores/` | Professor | Atualiza os dados do próprio professor |
| `DELETE` | `/professores/` | Professor | Deleta o próprio professor |

### Administradores

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| `GET` | `/administradores/` | Administrador | Lista todos os administradores |
| `POST` | `/administradores/` | Administrador | Cria um administrador |
| `GET` | `/administradores/me` | Administrador | Busca os próprios dados |
| `GET` | `/administradores/{administrador_id}` | Administrador | Busca administrador por ID |
| `PUT` | `/administradores/` | Administrador | Atualiza os dados do próprio administrador |
| `DELETE` | `/administradores/{administrador_id}` | Administrador | Desativa um administrador |

### Contas

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| `PUT` | `/contas/me` | JWT | Atualiza nome e email da conta autenticada |

### Disciplinas

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| `POST` | `/disciplinas/` | Professor | Cria uma disciplina |
| `GET` | `/disciplinas/` | Público | Lista todas as disciplinas |
| `GET` | `/disciplinas/{disciplina_id}` | Público | Busca uma disciplina por ID |
| `GET` | `/disciplinas/{disciplina_id}/modulos` | Público | Lista os módulos de uma disciplina |
| `GET` | `/disciplinas/{disciplina_id}/aulas/count` | Público | Conta as aulas de uma disciplina |
| `PUT` | `/disciplinas/{disciplina_id}` | Professor/Admin | Atualiza uma disciplina |
| `DELETE` | `/disciplinas/{disciplina_id}` | Professor/Admin | Deleta uma disciplina |

### Módulos

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| `POST` | `/modulos/disciplina/{disciplina_id}` | Professor | Cria um módulo em uma disciplina |
| `GET` | `/modulos/` | Público | Lista todos os módulos |
| `GET` | `/modulos/{modulo_id}` | Público | Busca um módulo por ID |
| `GET` | `/modulos/{modulo_id}/aulas` | Público | Lista as aulas de um módulo |
| `PUT` | `/modulos/{modulo_id}` | Professor/Admin | Atualiza um módulo |
| `DELETE` | `/modulos/{modulo_id}` | Professor/Admin | Deleta um módulo |

### Aulas

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| `POST` | `/aulas/modulo/{modulo_id}` | Professor | Cria uma aula em um módulo |
| `GET` | `/aulas/` | Público | Lista todas as aulas |
| `GET` | `/aulas/{aula_id}` | Público | Busca uma aula por ID |
| `GET` | `/aulas/{aula_id}/exercicios` | Público | Lista os exercícios de uma aula |
| `PUT` | `/aulas/{aula_id}` | Professor/Admin | Atualiza uma aula |
| `DELETE` | `/aulas/{aula_id}` | Professor/Admin | Deleta uma aula |

### Exercícios e alternativas

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| `POST` | `/exercicios/` | Professor | Cria um exercício |
| `GET` | `/exercicios/` | Público | Lista todos os exercícios |
| `GET` | `/exercicios/{exercicio_id}` | Público | Busca um exercício por ID |
| `GET` | `/exercicios/{exercicio_id}/alternativas` | Público | Lista alternativas de um exercício |
| `PUT` | `/exercicios/{exercicio_id}` | Professor/Admin | Atualiza um exercício |
| `DELETE` | `/exercicios/{exercicio_id}` | Professor/Admin | Deleta um exercício |
| `POST` | `/alternativas/exercicio/{exercicio_id}` | Professor | Cria uma alternativa |
| `GET` | `/alternativas/` | Público | Lista todas as alternativas |
| `GET` | `/alternativas/{alternativa_id}` | Público | Busca uma alternativa por ID |
| `PUT` | `/alternativas/{alternativa_id}` | Professor/Admin | Atualiza uma alternativa |
| `DELETE` | `/alternativas/{alternativa_id}` | Professor/Admin | Deleta uma alternativa |

### Simulados

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| `POST` | `/simulados/` | Professor | Cria um simulado |
| `GET` | `/simulados/` | Público | Lista todos os simulados |
| `GET` | `/simulados/{simulado_id}` | Público | Busca um simulado por ID |
| `GET` | `/simulados/{simulado_id}/exercicios` | Público | Lista exercícios de um simulado |
| `PUT` | `/simulados/{simulado_id}` | Professor/Admin | Atualiza um simulado |
| `DELETE` | `/simulados/{simulado_id}` | Professor/Admin | Deleta um simulado |
| `POST` | `/simulados/{simulado_id}/corrigir` | Aluno | Envia respostas e recebe a nota calculada pelo backend |

### Resultados

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| `POST` | `/resultados/` | JWT | Cria um resultado |
| `GET` | `/resultados/` | Professor | Lista todos os resultados |
| `GET` | `/resultados/me` | JWT | Lista os próprios resultados |
| `GET` | `/resultados/{resultado_id}` | Professor/Admin | Busca um resultado por ID |
| `GET` | `/resultados/aluno/{aluno_id}` | Professor/Admin | Lista resultados de um aluno |
| `GET` | `/resultados/simulado/{simulado_id}` | Professor/Admin | Lista resultados de um simulado |
| `GET` | `/resultados/aluno/{aluno_id}/simulado/{simulado_id}` | Professor/Admin | Busca o resultado de um aluno em um simulado |
| `PUT` | `/resultados/{resultado_id}` | Professor/Admin | Atualiza um resultado |
| `DELETE` | `/resultados/{resultado_id}` | Professor/Admin | Deleta um resultado |

### Conclusões de aula

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| `POST` | `/conclusao/{aula_id}` | JWT | Marca uma aula como concluída |
| `GET` | `/conclusao/{aula_id}` | JWT | Busca a conclusão do aluno na aula |
| `DELETE` | `/conclusao/{aula_id}` | JWT | Remove a conclusão da aula |

### Progresso

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| `GET` | `/progressos/me` | JWT | Lista o próprio progresso |
| `GET` | `/progressos/` | Professor/Admin | Lista o progresso de todos os alunos |
| `GET` | `/progressos/aluno/{aluno_id}` | Professor/Admin | Busca o progresso de um aluno |
| `GET` | `/progressos/disciplina/{disciplina_id}` | Professor/Admin | Busca o progresso dos alunos em uma disciplina |

## Estrutura do projeto

```text
BackEnd/
├── lib/                 # Instâncias e integrações compartilhadas
├── prisma/
│   ├── schema.prisma    # Modelo do banco
│   └── migrations/      # Histórico de migrações
├── src/
│   ├── controllers/     # Regras de entrada e saída das requisições
│   ├── middlewares/     # Autenticação e autorização por perfil
│   ├── repositories/    # Acesso ao banco via Prisma
│   ├── routers/         # Registro das rotas HTTP
│   ├── schemas/         # Schemas OpenAPI e validação das rotas
│   └── server.ts        # Inicialização do Fastify
├── docker-compose.yaml
├── package.json
├── prisma.config.ts
└── tsconfig.json
```

## Boas práticas de desenvolvimento

- Nunca versionar `.env` ou credenciais reais.
- Usar uma chave forte e exclusiva em `JWT_SECRET`.
- Aplicar `npx prisma migrate dev` após alterações no schema.
- Regenerar o cliente com `npx prisma generate` quando o schema mudar.
- Conferir os schemas e respostas no Swagger antes de integrar um novo cliente.
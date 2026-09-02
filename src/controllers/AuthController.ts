import type { FastifyRequest, FastifyReply } from "fastify";
import type { Aluno, Professor } from "../../generated/prisma/client.js";
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import * as authRepository from '../repositories/AuthRepository.js';

export const loginController = async (
    request: FastifyRequest<{Body: {email : string, senha : string}}>,
    reply: FastifyReply
) => {
    const { email, senha } = request.body;

    if(!email || !senha) {
        return reply.status(400).send({message: "Email e senha são obrigatórios"});
    }

    const user = await authRepository.findEmail(email);

    if (!user) {
        return reply.status(401).send({message: "Email ou senha incorreto"});
    }

    const senhaValida = await argon2.verify(user.senha, senha);

    if (!senhaValida) {
        return reply.status(401).send({message: "Email ou senha está incorreta"});
    }

    let userId: string | undefined;

    if (user.role === 'ALUNO') {
        userId = user.aluno?.id;
    } else if (user.role === 'ADMINISTRADOR') {
        userId = user.administrador?.id;
    } else if (user.role === 'PROFESSOR') {
        userId = user.professor?.id;
    }

    const token = jwt.sign(
        {
            id: userId,
            role: user.role,
            conta_id: user.id
        },
        process.env.JWT_SECRET || 'secret',
        {
            expiresIn: '1h'
        }
    );

    if (user.role === 'ALUNO') {
        if (!user.aluno) {
            return reply.status(404).send({ message: "Aluno nao encontrado" });
        }

        return reply.status(200).send({
            aluno: user.aluno,
            token
        });
    }

    if (user.role === 'PROFESSOR') {
        if (!user.professor) {
            return reply.status(404).send({ message: "Professor nao encontrado" });
        }

        if (user.professor.ativo === false) {
            return reply.status(401).send({ message: "Professor desativado" });
        }

        return reply.status(200).send({
            professor: user.professor,
            token
        });
    }

    if (user.role === 'ADMINISTRADOR') {
        if (!user.administrador) {
            return reply.status(404).send({ message: "Administrador nao encontrado" });
        }

        if (user.administrador.ativo === false) {
            return reply.status(401).send({ message: "Administrador desativado" });
        }

        return reply.status(200).send({
            administrador: user.administrador,
            token
        });
    }



}
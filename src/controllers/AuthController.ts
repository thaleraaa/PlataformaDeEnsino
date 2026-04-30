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
        return reply.status(401).send({message: "Email ou senha incorreto"});
    }

    const token = jwt.sign(
        {
            email: email,
            id: user.id
        },
        process.env.JWT_SECRET as string,
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

        return reply.status(200).send({
            professor: user.professor,
            token
        });
    }

    if (user.role === 'ADMINISTRADOR') {
        if (!user.administrador) {
            return reply.status(404).send({ message: "Administrador nao encontrado" });
        }

        return reply.status(200).send({
            administrador: user.administrador,
            token
        });
    }



}
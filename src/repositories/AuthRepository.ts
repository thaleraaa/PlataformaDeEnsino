import { prisma} from '../../lib/prisma.js';

export const findEmail = async (email: string) => {
    return prisma.conta.findUnique({ 
        where: { 
            email: email
         },
        include: {
            aluno: true,
            professor: true,
            administrador: true
        }
    });
};

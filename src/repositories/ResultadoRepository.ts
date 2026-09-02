import { prisma } from '../../lib/prisma.js';
import type { Resultado } from '../../generated/prisma/client.js';

export class ResultadoRepository {
    
    public async findAll(): Promise<Resultado[]> {
        return prisma.resultado.findMany({
            include: {
                simulado: true,
                aluno: true
            }
        });
    }

    public async findById(id: string): Promise<Resultado | null> {
        return prisma.resultado.findUnique({
            where: {
                id: id
            },
            include: {
                simulado: true,
                aluno: true
            }
        });
    }

    public async findByAlunoAndSimulado(aluno_id: string, simulado_id: string): Promise<Resultado | null> {
        return prisma.resultado.findUnique({
            where: {
                aluno_id_simulado_id: {
                    aluno_id,
                    simulado_id
                }
            },
            include: {
                simulado: true,
                aluno: true
            }
        });
    }

    public async findByAluno(aluno_id: string): Promise<Resultado[]> {
        return prisma.resultado.findMany({
            where: {
                aluno_id
            },
            include: {
                simulado: true,
                aluno: true
            }
        });
    }

    public async findBySimulado(simulado_id: string): Promise<Resultado[]> {
        return prisma.resultado.findMany({
            where: {
                simulado_id
            },
            include: {
                simulado: true,
                aluno: true
            }
        });
    }

    public async create(data: Omit<Resultado, 'id' | 'created_at' | 'updated_at'>): Promise<Resultado> {
        return prisma.resultado.create({
            data,
            include: {
                simulado: true,
                aluno: true
            }
        });
    }

    public async update(id: string, data: Partial<Omit<Resultado, 'id' | 'created_at' | 'updated_at' | 'aluno_id' | 'simulado_id'>>): Promise<Resultado> {
        return prisma.resultado.update({
            where: {
                id: id
            },
            data,
            include: {
                simulado: true,
                aluno: true
            }
        });
    }

    public async delete(id: string): Promise<Resultado> {
        return prisma.resultado.delete({
            where: {
                id: id
            },
            include: {
                simulado: true,
                aluno: true
            }
        });
    }
}

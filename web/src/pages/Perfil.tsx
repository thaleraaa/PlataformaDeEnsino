import { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Avatar,
  CircularProgress, Alert, Chip, Divider, Stack,
} from '@mui/material';
import {
  Person, Email, School, Badge, LocalHospital,
  AttachMoney, CheckCircle, Cancel,
} from '@mui/icons-material';
import { api } from '../services/api';
import type { Role } from '../mockData';

interface ContaInfo {
  id: string;
  nome: string;
  email: string;
  role: Role;
}

interface PerfilAluno {
  id: string;
  periodo: number;
  faculdade: string;
  conta: ContaInfo;
}

interface PerfilProfessor {
  id: string;
  CRM: string;
  salario: number;
  ativo: boolean;
  conta: ContaInfo;
}

interface PerfilAdmin {
  id: string;
  ativo: boolean;
  conta: ContaInfo;
}

type PerfilData = PerfilAluno | PerfilProfessor | PerfilAdmin;

interface PerfilProps {
  userRole: Role;
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5 }}>
      <Box sx={{ color: 'primary.main', display: 'flex' }}>{icon}</Box>
      <Box>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Typography variant="body1" fontWeight={500}>{value}</Typography>
      </Box>
    </Box>
  );
}

export function Perfil({ userRole }: PerfilProps) {
  const [dados, setDados] = useState<PerfilData | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setErro('Não autenticado.'); setLoading(false); return; }

    const endpoint =
      userRole === 'ALUNO'         ? '/alunos/me'
      : userRole === 'PROFESSOR'   ? '/professores/me'
      :                              '/administradores/me';

    api.get(endpoint, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setDados(res.data))
      .catch(() => setErro('Erro ao carregar perfil.'))
      .finally(() => setLoading(false));
  }, [userRole]);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <CircularProgress />
    </Box>
  );

  if (erro || !dados) return (
    <Alert severity="error" sx={{ mt: 4 }}>{erro ?? 'Dados não encontrados.'}</Alert>
  );

  const conta = dados.conta;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" fontWeight={700} mb={3}>Meu Perfil</Typography>

      <Card elevation={2}>
        <CardContent sx={{ p: 4 }}>
          {/* Header com avatar */}
          <Stack direction="row" alignItems="center" gap={3} mb={3}>
            <Avatar sx={{ width: 72, height: 72, bgcolor: 'primary.main', fontSize: 32 }}>
              {conta.nome.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>{conta.nome}</Typography>
              <Chip
                label={conta.role}
                color="primary"
                size="small"
                sx={{ mt: 0.5 }}
              />
            </Box>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          {/* Campos comuns */}
          <InfoRow icon={<Person />} label="Nome completo" value={conta.nome} />
          <InfoRow icon={<Email />} label="E-mail" value={conta.email} />

          {/* Campos específicos por role */}
          {userRole === 'ALUNO' && (() => {
            const aluno = dados as PerfilAluno;
            return (
              <>
                <InfoRow icon={<School />} label="Faculdade" value={aluno.faculdade} />
                <InfoRow icon={<Badge />}  label="Período"   value={`${aluno.periodo}º período`} />
              </>
            );
          })()}

          {userRole === 'PROFESSOR' && (() => {
            const prof = dados as PerfilProfessor;
            return (
              <>
                <InfoRow icon={<LocalHospital />} label="CRM"     value={prof.CRM} />
                <InfoRow icon={<AttachMoney />}   label="Salário" value={`R$ ${Number(prof.salario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                <InfoRow
                  icon={prof.ativo ? <CheckCircle color="success" /> : <Cancel color="error" />}
                  label="Status"
                  value={prof.ativo ? 'Ativo' : 'Inativo'}
                />
              </>
            );
          })()}

          {userRole === 'ADMINISTRADOR' && (() => {
            const adm = dados as PerfilAdmin;
            return (
              <InfoRow
                icon={adm.ativo ? <CheckCircle color="success" /> : <Cancel color="error" />}
                label="Status"
                value={adm.ativo ? 'Ativo' : 'Inativo'}
              />
            );
          })()}
        </CardContent>
      </Card>
    </Box>
  );
}
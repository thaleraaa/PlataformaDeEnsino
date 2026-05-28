import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField,
  Button, Container, Avatar, Stack, CircularProgress,
} from '@mui/material';
import { School } from '@mui/icons-material';
import type { Role } from '../mockData';

const BASE_URL = 'http://localhost:3000';

interface LoginProps {
  onLogin: (role: Role, userName: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleLogin = async () => {
  setLoading(true);
  setErro(null);

  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha, role: selectedRole }),
    });

    const data = await res.json();
    localStorage.setItem('token', data.token);

    // pega o role do JWT
    const payload = JSON.parse(atob(data.token.split('.')[1]));

    // busca os dados completos do usuário logado
    const prefixos: Record<string, string> = {
      ALUNO: 'alunos',
      PROFESSOR: 'professores',
      ADMINISTRADOR: 'administradores',
    };
    const prefixo = prefixos[payload.role];

    const meRes = await fetch(`${BASE_URL}/${prefixo}/me`, {
      headers: { Authorization: `Bearer ${data.token}` }
    });
    const me = await meRes.json();

    // nome vem dentro de conta
    onLogin(payload.role, me.conta.nome);

  } catch (err) {
    console.error(err);
    setErro('Erro ao conectar com o servidor.');
  } finally {
    setLoading(false);
  }
};

  if (!selectedRole) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <School sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h3" fontWeight={600} gutterBottom>MedEdu</Typography>
            <Typography variant="body1" color="text.secondary">
              Plataforma de Ensino para Estudantes de Medicina
            </Typography>
          </Box>

          <Typography variant="h5" textAlign="center" mb={4}>Selecione seu perfil</Typography>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            {[
              { role: 'ALUNO' as Role,         cor: 'primary.main',  desc: 'Acesse suas disciplinas e simulados' },
              { role: 'PROFESSOR' as Role,     cor: 'secondary.main', desc: 'Gerencie aulas e exercícios' },
              { role: 'ADMINISTRADOR' as Role, cor: '#f59e0b',        desc: 'Administre a plataforma' },
            ].map(({ role, cor, desc }) => (
              <Card
                key={role}
                sx={{ flex: 1, cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}
                onClick={() => setSelectedRole(role)}
              >
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Avatar sx={{ width: 64, height: 64, mx: 'auto', mb: 2, bgcolor: cor }}>
                    <School sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Typography variant="h6" gutterBottom>{role.charAt(0) + role.slice(1).toLowerCase()}</Typography>
                  <Typography variant="body2" color="text.secondary">{desc}</Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
      <Container maxWidth="sm">
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <School sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Login - {selectedRole}
              </Typography>
              <Typography variant="body2" color="text.secondary">Entre com suas credenciais</Typography>
            </Box>

            <Stack spacing={3}>
              <TextField fullWidth label="Email" type="email" value={email}
                onChange={(e) => setEmail(e.target.value)} />
              <TextField fullWidth label="Senha" type="password" value={senha}
                onChange={(e) => setSenha(e.target.value)} />

              {/* Mostra erro se login falhar */}
              {erro && (
                <Typography color="error" variant="body2" textAlign="center">
                  {erro}
                </Typography>
              )}

              <Button fullWidth variant="contained" size="large"
                onClick={handleLogin} disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
              </Button>

              <Button fullWidth variant="text" onClick={() => { setSelectedRole(null); setErro(null); }}>
                Voltar
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
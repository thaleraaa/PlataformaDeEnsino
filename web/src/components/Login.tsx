import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField,
  Button, Container, Stack, CircularProgress,
} from '@mui/material';
import { School } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { Role } from '../mockData';

const BASE_URL = 'http://localhost:3000';

interface LoginProps {
  onLogin: (role: Role, userName: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();
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
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();
      localStorage.setItem('token', data.token);

      const payload = JSON.parse(atob(data.token.split('.')[1]));
      const conta = data.aluno?.conta ?? data.professor?.conta ?? data.administrador?.conta;

      onLogin(payload.role, conta?.nome ?? email);

    } catch (err) {
      console.error(err);
      setErro('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <School sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" fontWeight={600} gutterBottom>MedEdu</Typography>
          <Typography variant="body1" color="text.secondary">
            Plataforma de Ensino para Estudantes de Medicina
          </Typography>
        </Box>

        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight={600} textAlign="center" gutterBottom>
              Entrar
            </Typography>

            <Stack spacing={3} mt={2}>
              <TextField fullWidth label="Email" type="email" value={email}
                onChange={(e) => setEmail(e.target.value)} />
              <TextField fullWidth label="Senha" type="password" value={senha}
                onChange={(e) => setSenha(e.target.value)} />

              {erro && (
                <Typography color="error" variant="body2" textAlign="center">{erro}</Typography>
              )}

              <Button fullWidth variant="contained" size="large"
                onClick={handleLogin} disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
              </Button>

              <Button fullWidth variant="outlined" size="large" onClick={() => navigate('/register')}>
                Não tem conta? Cadastre-se
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
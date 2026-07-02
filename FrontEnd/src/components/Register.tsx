import {
  Box, Card, CardContent, Typography, TextField,
  Button, Container, Stack, CircularProgress,
} from '@mui/material';
import { School } from '@mui/icons-material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';

interface IRegisterAluno {
  nome: string;
  email: string;
  senha: string;
  periodo: string;
  faculdade: string;
}

const schema = yup.object({
  nome: yup.string().matches(/^[A-Za-zÀ-ÿ\s]+$/, 'Não pode conter números').required('Nome é obrigatório'),
  email: yup.string().email('Email Inválido').required('Email é obrigatório'),
  senha: yup.string().min(6, 'Senha deve ter no mínimo 6 caracteres').required('Senha é obrigatório'),
  periodo: yup.string().matches(/^[0-9]+$/, 'Apenas números são permitidos').required('O período é obrigatório'),
  faculdade: yup.string().matches(/^[A-Za-zÀ-ÿ\s]+$/, 'Não pode conter números').required('Faculdade é obrigatório'),
}).required();

const BASE_URL = 'http://localhost:3000';

export function Register() {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<IRegisterAluno>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: IRegisterAluno) => {
    setLoading(true);
    setErro(null);

    try {
      await axios.post(`${BASE_URL}/alunos`, data);
      setSucesso(true);
    } catch (err) {
      const mensagem = axios.isAxiosError(err) ? err.response?.data?.message : null;
      setErro(mensagem || 'Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  if (sucesso) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
        <Container maxWidth="sm">
          <Card>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <School sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Cadastro realizado!
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Sua conta foi criada com sucesso.
              </Typography>
              <Button variant="contained" fullWidth href="/">
                Ir para o Login
              </Button>
            </CardContent>
          </Card>
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
                Realize seu cadastro
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Preencha os dados para criar sua conta
              </Typography>
            </Box>

            {/* handleSubmit do react-hook-form via onSubmit, sem tag form */}
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Nome"
                {...register('nome')}
                error={!!errors.nome}
                helperText={errors.nome?.message}
              />
              <TextField
                fullWidth
                label="Faculdade"
                {...register('faculdade')}
                error={!!errors.faculdade}
                helperText={errors.faculdade?.message}
              />
              <TextField
                fullWidth
                label="Período"
                type="number"
                {...register('periodo')}
                error={!!errors.periodo}
                helperText={errors.periodo?.message}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                fullWidth
                label="Senha"
                type="password"
                {...register('senha')}
                error={!!errors.senha}
                helperText={errors.senha?.message}
              />

              {erro && (
                <Typography color="error" variant="body2" textAlign="center">
                  {erro}
                </Typography>
              )}

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSubmit(onSubmit)}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Cadastrar'}
              </Button>

              <Button fullWidth variant="text" href="../">
                Já tem conta? Entrar
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
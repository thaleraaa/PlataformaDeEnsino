import {
  Box, Card, CardContent, Typography, TextField,
  Button, Container, Stack, CircularProgress,
  InputAdornment, Switch, FormControlLabel,
} from '@mui/material';
import { Person } from '@mui/icons-material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';

interface ICadastrarProfessor {
  nome: string;
  email: string;
  senha: string;
  crm: string;
  salario: number;
  ativo: boolean;
}

const schema = yup.object({
  nome: yup
    .string()
    .matches(/^[A-Za-zÀ-ÿ\s]+$/, 'O nome não pode conter números ou símbolos')
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .required('Nome é obrigatório'),
  email: yup
    .string()
    .email('Formato de e-mail inválido (ex: nome@dominio.com)')
    .required('E-mail é obrigatório'),
  senha: yup
    .string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .matches(/[A-Z]/, 'Deve conter ao menos uma letra maiúscula')
    .required('Senha é obrigatória'),
  crm: yup
    .string()
    .matches(/^\d{4,6}\/[A-Z]{2}$/, 'CRM inválido. Use o formato: 123456/UF')
    .required('CRM é obrigatório'),
  salario: yup
    .number()
    .typeError('Salário deve ser um número')
    .positive('Salário deve ser maior que zero')
    .required('Salário é obrigatório'),
  ativo: yup.boolean().required(),
}).required();

const BASE_URL = 'http://localhost:3000';

export function CadastrarProfessor() {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ICadastrarProfessor>({
    resolver: yupResolver(schema),
    defaultValues: { ativo: true },
  });

  const onSubmit = async (data: ICadastrarProfessor) => {
    setLoading(true);
    setErro(null);
    try {
      await axios.post(`${BASE_URL}/professores`, {
        CRM: data.crm,
        salario: data.salario,
        ativo: data.ativo,
        conta: {
          nome: data.nome,
          email: data.email,
          senha: data.senha,
          role: 'PROFESSOR',
        },
      });

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
              <Person sx={{ fontSize: 64, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Professor cadastrado!
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                O cadastro do professor foi realizado com sucesso.
              </Typography>
              <Button variant="contained" fullWidth href="/login">
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
              <Person sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Cadastrar Professor
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Preencha os dados do novo professor
              </Typography>
            </Box>

            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Nome Completo"
                {...register('nome')}
                error={!!errors.nome}
                helperText={errors.nome?.message}
              />

              <TextField
                fullWidth
                label="E-mail"
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

              <TextField
                fullWidth
                label="CRM"
                placeholder="123456/SP"
                {...register('crm')}
                error={!!errors.crm}
                helperText={errors.crm?.message ?? 'Formato: número/UF (ex: 12345/SP)'}
              />

              <TextField
                fullWidth
                label="Salário"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
                {...register('salario')}
                error={!!errors.salario}
                helperText={errors.salario?.message}
              />

              <Controller
                name="ativo"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        color="secondary"
                      />
                    }
                    label="Professor ativo"
                  />
                )}
              />

              {erro && (
                <Typography color="error" variant="body2" textAlign="center">
                  {erro}
                </Typography>
              )}

              <Button
                fullWidth
                variant="contained"
                color="secondary"
                size="large"
                onClick={handleSubmit(onSubmit)}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Cadastrar Professor'}
              </Button>

              <Button fullWidth variant="text" href="/login">
                Já tem conta? Entrar
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  InputAdornment,
  Switch,
  FormControlLabel,
  IconButton,
} from '@mui/material';
import {
  Groups,
  School,
  TrendingUp,
  PersonAdd,
  Close,
  CheckCircle,
} from '@mui/icons-material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';

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

export function DashboardAdmin() {
  const [professores, setProfessores] = useState([
    { id: '1', nome: 'Dr. João Silva', CRM: '123456/SP', disciplinas: 3, ativo: true },
    { id: '2', nome: 'Dra. Maria Oliveira', CRM: '234567/RJ', disciplinas: 2, ativo: true },
    { id: '3', nome: 'Dr. Pedro Santos', CRM: '345678/MG', disciplinas: 1, ativo: false },
  ]);

  const [modalAberto, setModalAberto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ICadastrarProfessor>({
    resolver: yupResolver(schema),
    defaultValues: { ativo: true },
  });

  const handleAbrirModal = () => {
    reset();
    setErro(null);
    setSucesso(false);
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setSucesso(false);
    setErro(null);
    reset();
  };

  const onSubmit = async (data: ICadastrarProfessor) => {
    setLoading(true);
    setErro(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/professores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: data.nome,
          email: data.email,
          senha: data.senha,
          CRM: data.crm,
          salario: data.salario,
          ativo: data.ativo,
          role: 'PROFESSOR',
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setErro(err.message || 'Erro ao cadastrar professor.');
        return;
      }

      setProfessores((prev) => [
        ...prev,
        {
          id: String(prev.length + 1),
          nome: data.nome,
          CRM: data.crm,
          disciplinas: 0,
          ativo: data.ativo,
        },
      ]);

      setSucesso(true);
    } catch {
      setErro('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Dashboard Administrativo
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Gerencie professores e alunos da plataforma.
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>Total de Professores</Typography>
                  <Typography variant="h4" fontWeight={600}>{professores.length}</Typography>
                </Box>
                <Groups sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>Total de Alunos</Typography>
                  <Typography variant="h4" fontWeight={600}>156</Typography>
                </Box>
                <School sx={{ fontSize: 40, color: 'secondary.main', opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>Professores Ativos</Typography>
                  <Typography variant="h4" fontWeight={600}>{professores.filter((p) => p.ativo).length}</Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Button variant="contained" fullWidth startIcon={<PersonAdd />} size="large" onClick={handleAbrirModal}>
                Novo Professor
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={3}>Professores Cadastrados</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Professor</TableCell>
                  <TableCell>CRM</TableCell>
                  <TableCell>Disciplinas</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {professores.map((professor) => (
                  <TableRow key={professor.id}>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>{professor.nome.charAt(0)}</Avatar>
                        <Typography variant="body2" fontWeight={500}>{professor.nome}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{professor.CRM}</TableCell>
                    <TableCell>{professor.disciplinas} disciplinas</TableCell>
                    <TableCell align="center">
                      <Chip label={professor.ativo ? 'Ativo' : 'Inativo'} color={professor.ativo ? 'success' : 'default'} size="small" />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" variant="outlined">Editar</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={modalAberto} onClose={handleFecharModal} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
              <PersonAdd color="primary" />
              <Typography variant="h6" fontWeight={600}>Cadastrar Novo Professor</Typography>
            </Stack>
            <IconButton onClick={handleFecharModal} size="small"><Close /></IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          {sucesso ? (
            <Stack alignItems="center" spacing={2} py={3}>
              <CheckCircle sx={{ fontSize: 64, color: 'success.main' }} />
              <Typography variant="h6" fontWeight={600}>Professor cadastrado com sucesso!</Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                O novo professor já aparece na lista e poderá acessar a plataforma com as credenciais cadastradas.
              </Typography>
            </Stack>
          ) : (
            <Stack spacing={3} pt={1}>
              <TextField fullWidth label="Nome Completo" {...register('nome')} error={!!errors.nome} helperText={errors.nome?.message} />
              <TextField fullWidth label="E-mail" type="email" {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
              <TextField fullWidth label="Senha" type="password" {...register('senha')} error={!!errors.senha} helperText={errors.senha?.message ?? 'Mínimo 6 caracteres, ao menos uma maiúscula'} />
              <TextField fullWidth label="CRM" placeholder="123456/SP" {...register('crm')} error={!!errors.crm} helperText={errors.crm?.message ?? 'Formato: número/UF (ex: 12345/SP)'} />
              <TextField
                fullWidth
                label="Salário"
                type="number"
                InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }}
                {...register('salario')}
                error={!!errors.salario}
                helperText={errors.salario?.message}
              />
              <Controller
                name="ativo"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} color="primary" />}
                    label="Professor ativo ao cadastrar"
                  />
                )}
              />
              {erro && <Typography color="error" variant="body2" textAlign="center">{erro}</Typography>}
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          {sucesso ? (
            <Button variant="contained" fullWidth onClick={handleFecharModal}>Fechar</Button>
          ) : (
            <>
              <Button variant="outlined" onClick={handleFecharModal} disabled={loading}>Cancelar</Button>
              <Button
                variant="contained"
                onClick={handleSubmit(onSubmit)}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <PersonAdd />}
              >
                {loading ? 'Cadastrando...' : 'Cadastrar Professor'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
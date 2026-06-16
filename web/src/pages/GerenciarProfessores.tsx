import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Stack,
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
  InputBase,
  Paper,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  PersonAdd,
  Close,
  CheckCircle,
  Search,
  Edit,
  Block,
  CheckCircleOutline,
  Groups,
  TrendingUp,
  PersonOff,
} from '@mui/icons-material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { useState, useMemo, useEffect } from 'react';

interface Professor {
  id: string;
  nome: string;
  email: string;
  CRM: string;
  disciplinas: number;
  ativo: boolean;
}

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

export function GerenciarProfessores() {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [loadingDados, setLoadingDados] = useState(true);
  const [erroDados, setErroDados] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
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

  useEffect(() => {
    const fetchProfessores = async () => {
      setLoadingDados(true);
      setErroDados(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${BASE_URL}/professores`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          setErroDados('Erro ao carregar professores.');
          return;
        }

        const data = await res.json();

        const lista: Professor[] = data.map((p: any) => ({
          id: String(p.id),
          nome: p.conta?.nome ?? p.nome ?? '—',
          email: p.conta?.email ?? p.email ?? '—',
          CRM: p.CRM ?? '—',
          disciplinas: p.disciplinas?.length ?? p.disciplinas ?? 0,
          ativo: p.ativo ?? true,
        }));

        setProfessores(lista);
      } catch {
        setErroDados('Erro ao conectar com o servidor.');
      } finally {
        setLoadingDados(false);
      }
    };

    fetchProfessores();
  }, []);

  const professoresFiltrados = useMemo(() => {
    if (!busca.trim()) return professores;
    const termo = busca.toLowerCase();
    return professores.filter(
      (p) =>
        p.nome.toLowerCase().includes(termo) ||
        p.email.toLowerCase().includes(termo) ||
        p.CRM.toLowerCase().includes(termo)
    );
  }, [professores, busca]);

  const totalAtivos = professores.filter((p) => p.ativo).length;
  const totalInativos = professores.filter((p) => !p.ativo).length;

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

  const toggleAtivo = (id: string) => {
    setProfessores((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ativo: !p.ativo } : p))
    );
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

      const criado = await res.json();

      setProfessores((prev) => [
        ...prev,
        {
          id: String(criado.id ?? Date.now()),
          nome: criado.conta?.nome ?? data.nome,
          email: criado.conta?.email ?? data.email,
          CRM: criado.CRM ?? data.crm,
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
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
        <Box>
          <Typography variant="h4" fontWeight={600}>
            Professores
          </Typography>
          <Typography variant="body1" color="text.secondary" mt={0.5}>
            Gerencie todos os professores cadastrados na plataforma.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<PersonAdd />} size="large" onClick={handleAbrirModal}>
          Novo Professor
        </Button>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={4} mb={4}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>Total de Professores</Typography>
                <Typography variant="h4" fontWeight={700}>{professores.length}</Typography>
              </Box>
              <Groups sx={{ fontSize: 44, color: 'primary.main', opacity: 0.25 }} />
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>Professores Ativos</Typography>
                <Typography variant="h4" fontWeight={700} color="success.main">{totalAtivos}</Typography>
              </Box>
              <TrendingUp sx={{ fontSize: 44, color: 'success.main', opacity: 0.25 }} />
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>Professores Inativos</Typography>
                <Typography variant="h4" fontWeight={700} color="text.disabled">{totalInativos}</Typography>
              </Box>
              <PersonOff sx={{ fontSize: 44, color: 'text.disabled', opacity: 0.4 }} />
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <Card>
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
            <Typography variant="h6" fontWeight={600}>Lista de Professores</Typography>
            <Paper variant="outlined" sx={{ display: 'flex', alignItems: 'center', px: 1.5, py: 0.5, borderRadius: 2, width: 280 }}>
              <Search sx={{ color: 'text.disabled', mr: 1, fontSize: 20 }} />
              <InputBase
                placeholder="Buscar por nome, e-mail ou CRM..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                sx={{ flex: 1, fontSize: 14 }}
              />
            </Paper>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Professor</TableCell>
                  <TableCell>CRM</TableCell>
                  <TableCell>E-mail</TableCell>
                  <TableCell>Disciplinas</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingDados ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={32} />
                    </TableCell>
                  </TableRow>
                ) : erroDados ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Typography color="error">{erroDados}</Typography>
                    </TableCell>
                  </TableRow>
                ) : professoresFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Typography color="text.secondary">
                        {busca ? `Nenhum professor encontrado para "${busca}".` : 'Nenhum professor cadastrado.'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  professoresFiltrados.map((professor) => (
                    <TableRow key={professor.id} hover>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar sx={{ bgcolor: professor.ativo ? 'primary.main' : 'action.disabled' }}>
                            {professor.nome.charAt(0)}
                          </Avatar>
                          <Typography variant="body2" fontWeight={500}>{professor.nome}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">{professor.CRM}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">{professor.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${professor.disciplinas} disciplina${professor.disciplinas !== 1 ? 's' : ''}`}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={professor.ativo ? 'Ativo' : 'Inativo'}
                          color={professor.ativo ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          <Tooltip title="Editar">
                            <IconButton size="small">
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={professor.ativo ? 'Desativar' : 'Ativar'}>
                            <IconButton
                              size="small"
                              color={professor.ativo ? 'error' : 'success'}
                              onClick={() => toggleAtivo(professor.id)}
                            >
                              {professor.ativo ? <Block fontSize="small" /> : <CheckCircleOutline fontSize="small" />}
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {!loadingDados && professoresFiltrados.length > 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
              Exibindo {professoresFiltrados.length} de {professores.length} professor{professores.length !== 1 ? 'es' : ''}
            </Typography>
          )}
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
import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Tabs, Tab, Card, CardContent, Stack,
  TextField, Button, CircularProgress, Alert, Chip,
  InputAdornment, Divider, LinearProgress, Tooltip,
  IconButton, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions,
} from '@mui/material';
import {
  Quiz, AccessTime, CheckCircle, RocketLaunch,
  Add, Refresh, Delete, Assignment,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';
const token = () => localStorage.getItem('token') ?? '';
const auth = () => ({ headers: { Authorization: `Bearer ${token()}` } });

// ─── Tipos ────────────────────────────────────────────────
interface Simulado {
  id: string;
  titulo: string;
  quantidadeQuestao: number;
  tempoMaximo: number;
  ativo: boolean;
  created_at: string;
  exercicio: { id: string }[];
}

// ─── Schema Yup ───────────────────────────────────────────
interface IFormSimulado {
  titulo: string;
  quantidadeQuestao: number;
  tempoMaximo: number;
}

const schema = yup.object({
  titulo: yup
    .string()
    .min(3, 'Título deve ter no mínimo 3 caracteres')
    .required('Título é obrigatório'),
  quantidadeQuestao: yup
    .number()
    .typeError('Informe um número válido')
    .integer('Deve ser inteiro')
    .min(1, 'Mínimo 1 questão')
    .max(200, 'Máximo 200 questões')
    .required('Obrigatório'),
  tempoMaximo: yup
    .number()
    .typeError('Informe um número válido')
    .integer('Deve ser inteiro')
    .min(5, 'Mínimo 5 minutos')
    .max(480, 'Máximo 480 minutos')
    .required('Obrigatório'),
}).required();

// ─── Sub-componente: card de simulado ─────────────────────
function SimuladoCard({
  simulado,
  onAtivar,
  onDeletar,
  ativando,
}: {
  simulado: Simulado;
  onAtivar: (id: string) => void;
  onDeletar: (id: string) => void;
  ativando: string | null;
}) {
  const qtdAtual = simulado.exercicio?.length ?? 0;
  const meta = simulado.quantidadeQuestao;
  const progresso = Math.min((qtdAtual / meta) * 100, 100);
  const pronto = qtdAtual >= meta;

  return (
    <Card variant="outlined" sx={{ position: 'relative' }}>
      {simulado.ativo && (
        <Box sx={{
          position: 'absolute', top: 12, right: 12,
        }}>
          <Chip label="ATIVO" color="success" size="small" icon={<CheckCircle />} />
        </Box>
      )}
      <CardContent>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h6" fontWeight={600} pr={simulado.ativo ? 10 : 0}>
              {simulado.titulo}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Criado em {new Date(simulado.created_at).toLocaleDateString('pt-BR')}
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Chip icon={<Quiz />} label={`${meta} questões`} size="small" variant="outlined" />
            <Chip icon={<AccessTime />} label={`${simulado.tempoMaximo} min`} size="small" variant="outlined" />
          </Stack>

          {/* Progresso de questões */}
          <Box>
            <Stack direction="row" justifyContent="space-between" mb={0.5}>
              <Typography variant="caption" color="text.secondary">
                Questões adicionadas
              </Typography>
              <Typography variant="caption" fontWeight={600} color={pronto ? 'success.main' : 'text.primary'}>
                {qtdAtual} / {meta}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={progresso}
              color={pronto ? 'success' : 'primary'}
              sx={{ borderRadius: 1, height: 6 }}
            />
          </Box>

          {!simulado.ativo && (
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Tooltip title="Deletar simulado">
                <IconButton size="small" color="error" onClick={() => onDeletar(simulado.id)}>
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={!pronto ? `Adicione mais ${meta - qtdAtual} questão(ões) para lançar` : 'Lançar para os alunos'}>
                <span>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    startIcon={
                      ativando === simulado.id
                        ? <CircularProgress size={14} color="inherit" />
                        : <RocketLaunch />
                    }
                    disabled={!pronto || ativando === simulado.id}
                    onClick={() => onAtivar(simulado.id)}
                  >
                    Lançar Simulado
                  </Button>
                </span>
              </Tooltip>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

// ─── Página principal ─────────────────────────────────────
export function SimuladosProfessor() {
  const [aba, setAba] = useState(0);
  const [simulados, setSimulados] = useState<Simulado[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [ativando, setAtivando] = useState<string | null>(null);
  const [deletarId, setDeletarId] = useState<string | null>(null);
  const [erroLista, setErroLista] = useState<string | null>(null);

  // form
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erroApi, setErroApi] = useState<string | null>(null);

  const {
    register, handleSubmit, reset, watch,
    formState: { errors },
  } = useForm<IFormSimulado>({ resolver: yupResolver(schema) });

  const qtd = watch('quantidadeQuestao');
  const tempo = watch('tempoMaximo');
  const tempoPorQuestao = qtd > 0 && tempo > 0 ? Math.floor((tempo * 60) / qtd) : null;

  // ── Carregar simulados com exercícios incluídos ──────────
  const carregarSimulados = useCallback(async () => {
    setCarregando(true);
    setErroLista(null);
    try {
      // GET /simulados retorna lista; para cada um buscamos os exercícios
      const { data } = await axios.get<Simulado[]>(`${BASE_URL}/simulados`, auth());
      // inclui exercícios via endpoint existente /:id/exercicios
      const comExercicios = await Promise.all(
        data.map(async (s) => {
          try {
            const { data: ex } = await axios.get(`${BASE_URL}/simulados/${s.id}/exercicios`, auth());
            return { ...s, exercicio: ex };
          } catch {
            return { ...s, exercicio: [] };
          }
        })
      );
      setSimulados(comExercicios);
    } catch {
      setErroLista('Erro ao carregar simulados.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregarSimulados(); }, [carregarSimulados]);

  // ── Criar simulado ───────────────────────────────────────
  const onSubmit = async (data: IFormSimulado) => {
    setSalvando(true);
    setErroApi(null);
    setSucesso(false);
    try {
      await axios.post(`${BASE_URL}/simulados`, {
        titulo: data.titulo.trim(),
        quantidadeQuestao: data.quantidadeQuestao,
        tempoMaximo: data.tempoMaximo,
      }, auth());
      reset();
      setSucesso(true);
      carregarSimulados();
      // volta pra aba de listagem após 1.2s
      setTimeout(() => { setAba(0); setSucesso(false); }, 1200);
    } catch (err) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.message : null;
      setErroApi(msg || 'Erro ao conectar com o servidor.');
    } finally {
      setSalvando(false);
    }
  };

  // ── Ativar simulado ──────────────────────────────────────
  const handleAtivar = async (id: string) => {
    setAtivando(id);
    try {
      await axios.put(`${BASE_URL}/simulados/${id}`, { ativo: true }, auth());
      setSimulados(prev => prev.map(s => s.id === id ? { ...s, ativo: true } : s));
    } catch {
      // silencia; pode-se adicionar snackbar depois
    } finally {
      setAtivando(null);
    }
  };

  // ── Deletar simulado ─────────────────────────────────────
  const handleDeletar = async () => {
    if (!deletarId) return;
    try {
      await axios.delete(`${BASE_URL}/simulados/${deletarId}`, auth());
      setSimulados(prev => prev.filter(s => s.id !== deletarId));
    } catch {
      // silencia
    } finally {
      setDeletarId(null);
    }
  };

  // ── Separar ativos / rascunhos ───────────────────────────
  const rascunhos = simulados.filter(s => !s.ativo);
  const ativos = simulados.filter(s => s.ativo);

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
        <Box>
          <Typography variant="h4" fontWeight={600}>Simulados</Typography>
          <Typography variant="body1" color="text.secondary">
            Crie simulados, adicione questões e lance para os alunos.
          </Typography>
        </Box>
        {aba === 0 && (
          <Tooltip title="Atualizar lista">
            <IconButton onClick={carregarSimulados}><Refresh /></IconButton>
          </Tooltip>
        )}
      </Stack>

      <Tabs value={aba} onChange={(_, v) => setAba(v)} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="Meus Simulados" icon={<Assignment />} iconPosition="start" />
        <Tab label="Criar Simulado" icon={<Add />} iconPosition="start" />
      </Tabs>

      {/* ── ABA 0: lista ── */}
      {aba === 0 && (
        <Box>
          {carregando ? (
            <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box>
          ) : erroLista ? (
            <Alert severity="error" action={
              <Button size="small" onClick={carregarSimulados}>Tentar novamente</Button>
            }>{erroLista}</Alert>
          ) : simulados.length === 0 ? (
            <Box textAlign="center" mt={8}>
              <Assignment sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography color="text.secondary" mb={2}>Nenhum simulado criado ainda.</Typography>
              <Button variant="contained" startIcon={<Add />} onClick={() => setAba(1)}>
                Criar primeiro simulado
              </Button>
            </Box>
          ) : (
            <Stack spacing={4}>
              {rascunhos.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} color="text.secondary" mb={2}>
                    Rascunhos ({rascunhos.length})
                  </Typography>
                  <Stack spacing={2}>
                    {rascunhos.map(s => (
                      <SimuladoCard
                        key={s.id}
                        simulado={s}
                        onAtivar={handleAtivar}
                        onDeletar={(id) => setDeletarId(id)}
                        ativando={ativando}
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {ativos.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} color="success.main" mb={2}>
                    Ativos — visíveis para os alunos ({ativos.length})
                  </Typography>
                  <Stack spacing={2}>
                    {ativos.map(s => (
                      <SimuladoCard
                        key={s.id}
                        simulado={s}
                        onAtivar={handleAtivar}
                        onDeletar={(id) => setDeletarId(id)}
                        ativando={ativando}
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </Stack>
          )}
        </Box>
      )}

      {/* ── ABA 1: criar ── */}
      {aba === 1 && (
        <Card sx={{ maxWidth: 560 }}>
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={3}>

              {/* Título */}
              <Box>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>
                  Título do Simulado
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Ex: Simulado de Clínica Médica — Turma 2024"
                  {...register('titulo')}
                  error={!!errors.titulo}
                  helperText={errors.titulo?.message ?? ' '}
                />
              </Box>

              {/* Quantidade */}
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <Quiz sx={{ color: 'primary.main', fontSize: 20 }} />
                  <Typography variant="subtitle2" fontWeight={600}>
                    Quantidade de Questões
                  </Typography>
                </Stack>
                <TextField
                  fullWidth type="number"
                  placeholder="Ex: 50"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">questões</InputAdornment>,
                    inputProps: { min: 1, max: 200 },
                  }}
                  {...register('quantidadeQuestao')}
                  error={!!errors.quantidadeQuestao}
                  helperText={errors.quantidadeQuestao?.message ?? 'Entre 1 e 200'}
                />
              </Box>

              {/* Tempo */}
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <AccessTime sx={{ color: 'primary.main', fontSize: 20 }} />
                  <Typography variant="subtitle2" fontWeight={600}>
                    Tempo Máximo
                  </Typography>
                </Stack>
                <TextField
                  fullWidth type="number"
                  placeholder="Ex: 120"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">minutos</InputAdornment>,
                    inputProps: { min: 5, max: 480 },
                  }}
                  {...register('tempoMaximo')}
                  error={!!errors.tempoMaximo}
                  helperText={errors.tempoMaximo?.message ?? 'Entre 5 e 480 minutos'}
                />
              </Box>

              {/* Preview */}
              {tempoPorQuestao !== null && (
                <>
                  <Divider />
                  <Box sx={{ bgcolor: 'background.default', borderRadius: 1, p: 2 }}>
                    <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                      Resumo
                    </Typography>
                    <Stack direction="row" spacing={3}>
                      <Box>
                        <Typography variant="h6" fontWeight={700} color="primary.main">{qtd}</Typography>
                        <Typography variant="caption" color="text.secondary">questões</Typography>
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight={700} color="primary.main">{tempo}min</Typography>
                        <Typography variant="caption" color="text.secondary">tempo total</Typography>
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight={700} color="secondary.main">~{tempoPorQuestao}s</Typography>
                        <Typography variant="caption" color="text.secondary">por questão</Typography>
                      </Box>
                    </Stack>
                  </Box>
                </>
              )}

              {sucesso && (
                <Alert severity="success" icon={<CheckCircle />}>
                  Simulado criado! Redirecionando para a lista...
                </Alert>
              )}
              {erroApi && (
                <Alert severity="error" onClose={() => setErroApi(null)}>{erroApi}</Alert>
              )}

              <Button
                fullWidth variant="contained" size="large"
                onClick={handleSubmit(onSubmit)}
                disabled={salvando}
              >
                {salvando ? <CircularProgress size={24} color="inherit" /> : 'Criar Simulado'}
              </Button>

            </Stack>
          </CardContent>
        </Card>
      )}

      {/* ── Dialog confirmar delete ── */}
      <Dialog open={!!deletarId} onClose={() => setDeletarId(null)}>
        <DialogTitle>Deletar simulado?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Essa ação é irreversível. O simulado e todos os vínculos com exercícios serão removidos.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletarId(null)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={handleDeletar}>Deletar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box, Typography, Card, CardContent, Stack, Chip, Button,
  CircularProgress, Alert, RadioGroup, FormControlLabel, Radio,
  LinearProgress, Divider, Grid,
} from '@mui/material';
import {
  Assignment, Timer, Quiz, CheckCircle, RocketLaunch,
} from '@mui/icons-material';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';
const auth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token') ?? ''}` } });

// ─── Tipos ────────────────────────────────────────────────
interface Alternativa { id: string; texto: string;}
interface Exercicio { id: string; enunciado: string; dificuldade: string; alternativa: Alternativa[]; }
interface Simulado { id: string; titulo: string; quantidadeQuestao: number; tempoMaximo: number; ativo: boolean; }
interface ResultadoImediato { acertos: number; total: number; nota: number; tempoGasto: number; }

// ─── Utils ────────────────────────────────────────────────
const formatTempo = (s: number) => {
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
};

// ─── Tela: lista de simulados ─────────────────────────────
function ListaSimulados({
  simulados, jaFeitos, carregando, erro, onIniciar,
}: {
  simulados: Simulado[];
  jaFeitos: Set<string>;
  carregando: boolean;
  erro: string | null;
  onIniciar: (s: Simulado) => void;
}) {
  if (carregando) return <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>;
  if (erro) return <Alert severity="error">{erro}</Alert>;
  if (simulados.length === 0)
    return (
      <Box textAlign="center" mt={8}>
        <Assignment sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
        <Typography color="text.secondary">Nenhum simulado disponível no momento.</Typography>
      </Box>
    );

  return (
    <Grid container spacing={3}>
      {simulados.map((s) => {
        const feito = jaFeitos.has(s.id);
        return (
          <Grid item xs={12} md={6} key={s.id}>
            <Card variant={feito ? 'outlined' : 'elevation'}>
              <CardContent>
                <Stack direction="row" alignItems="flex-start" spacing={2} mb={2}>
                  <Assignment sx={{ fontSize: 40, color: feito ? 'text.disabled' : 'primary.main', mt: 0.5 }} />
                  <Box flex={1}>
                    <Typography variant="h6" fontWeight={600}>{s.titulo}</Typography>
                    {feito && (
                      <Chip icon={<CheckCircle />} label="Já realizado" color="success" size="small" sx={{ mt: 0.5 }} />
                    )}
                  </Box>
                </Stack>

                <Stack direction="row" spacing={2} mb={3}>
                  <Chip icon={<Quiz />} label={`${s.quantidadeQuestao} questões`} size="small" variant="outlined" />
                  <Chip icon={<Timer />} label={`${s.tempoMaximo} min`} size="small" variant="outlined" />
                </Stack>

                {!feito && (
                  <Button variant="contained" fullWidth startIcon={<RocketLaunch />} onClick={() => onIniciar(s)}>
                    Iniciar Simulado
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

// ─── Tela: fazendo simulado ───────────────────────────────
function FazendoSimulado({
  simulado, exercicios, onConcluir,
}: {
  simulado: Simulado;
  exercicios: Exercicio[];
  onConcluir: (resultado: ResultadoImediato) => void;
}) {
  const totalSeg = simulado.tempoMaximo * 60;
  const [tempoRestante, setTempoRestante] = useState(totalSeg);
  const [atual, setAtual] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);
  const inicioRef = useRef(Date.now());

  // Timer regressivo
  useEffect(() => {
    const id = setInterval(() => {
      setTempoRestante(t => {
        if (t <= 1) { clearInterval(id); handleSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const progresso = ((atual + 1) / exercicios.length) * 100;
  const ex = exercicios[atual];
  const tempoGasto = Math.floor((Date.now() - inicioRef.current) / 1000);

  const handleSubmit = async () => {
    if (enviando) return;
    setEnviando(true);
    const t = Math.floor((Date.now() - inicioRef.current) / 1000);

    try {
        const respostasArray = exercicios.map(e => ({
            exercicio_id: e.id,
            alternativa_id: respostas[e.id] ?? null,
        }));

        const { data } = await axios.post(
            `${BASE_URL}/simulados/${simulado.id}/corrigir`,
            { respostas: respostasArray, tempoSegundos: t },
            auth()
        );

        onConcluir({ acertos: data.acertos, total: data.total, nota: data.nota, tempoGasto: t });
    } catch {
        setEnviando(false); // permite tentar de novo se der erro
    }
};

  const timerColor = tempoRestante < 60 ? 'error' : tempoRestante < 300 ? 'warning' : 'primary';

  return (
    <Box maxWidth={700} mx="auto">
      {/* Header fixo */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle2" color="text.secondary" noWrap sx={{ maxWidth: 300 }}>
              {simulado.titulo}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                icon={<Timer />}
                label={formatTempo(tempoRestante)}
                color={timerColor as any}
                variant={tempoRestante < 60 ? 'filled' : 'outlined'}
                size="small"
              />
              <Typography variant="caption" color="text.secondary">
                {atual + 1} / {exercicios.length}
              </Typography>
            </Stack>
          </Stack>
          <LinearProgress variant="determinate" value={progresso} sx={{ mt: 1, borderRadius: 1 }} />
        </CardContent>
      </Card>

      {/* Questão */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3}>
            <Box>
              <Chip
                label={`Questão ${atual + 1}`}
                color="primary"
                size="small"
                sx={{ mb: 1.5 }}
              />
              <Typography variant="body1" fontWeight={500} lineHeight={1.7}>
                {ex.enunciado}
              </Typography>
            </Box>

            <Divider />

            <RadioGroup
              value={respostas[ex.id] ?? ''}
              onChange={(_, v) => setRespostas(prev => ({ ...prev, [ex.id]: v }))}
            >
              <Stack spacing={1}>
                {ex.alternativa.map((alt, i) => (
                  <Card
                    key={alt.id}
                    variant="outlined"
                    sx={{
                      cursor: 'pointer',
                      borderColor: respostas[ex.id] === alt.id ? 'primary.main' : 'divider',
                      bgcolor: respostas[ex.id] === alt.id ? 'primary.50' : 'transparent',
                      transition: 'all .15s',
                      '&:hover': { borderColor: 'primary.light' },
                    }}
                    onClick={() => setRespostas(prev => ({ ...prev, [ex.id]: alt.id }))}
                  >
                    <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                      <FormControlLabel
                        value={alt.id}
                        control={<Radio size="small" />}
                        label={
                          <Typography variant="body2">
                            <strong>{String.fromCharCode(65 + i)})</strong> {alt.texto}
                          </Typography>
                        }
                        sx={{ m: 0, width: '100%' }}
                      />
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </RadioGroup>

            <Stack direction="row" spacing={2} justifyContent="flex-end" pt={1}>
              {atual > 0 && (
                <Button variant="outlined" onClick={() => setAtual(a => a - 1)}>
                  Anterior
                </Button>
              )}
              {atual < exercicios.length - 1 ? (
                <Button variant="contained" onClick={() => setAtual(a => a + 1)}>
                  Próxima
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={enviando ? <CircularProgress size={16} color="inherit" /> : <CheckCircle />}
                  disabled={enviando}
                  onClick={handleSubmit}
                >
                  Finalizar Simulado
                </Button>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

// ─── Tela: resultado imediato ─────────────────────────────
function ResultadoImediato({
  resultado, simulado, onVoltar,
}: {
  resultado: ResultadoImediato;
  simulado: Simulado;
  onVoltar: () => void;
}) {
  const aprovado = resultado.nota >= 7;
  const pct = (resultado.acertos / resultado.total) * 100;

  return (
    <Box maxWidth={560} mx="auto" textAlign="center">
      <Box mb={4}>
        <CheckCircle sx={{ fontSize: 72, color: aprovado ? 'success.main' : 'warning.main', mb: 1 }} />
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {aprovado ? 'Parabéns!' : 'Simulado concluído!'}
        </Typography>
        <Typography color="text.secondary">{simulado.titulo}</Typography>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h2" fontWeight={800} color={aprovado ? 'success.main' : 'warning.main'}>
                {resultado.nota.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">Nota final</Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={pct}
              color={aprovado ? 'success' : 'warning'}
              sx={{ height: 10, borderRadius: 5 }}
            />

            <Stack direction="row" justifyContent="space-around">
              <Box>
                <Typography variant="h5" fontWeight={700} color="success.main">{resultado.acertos}</Typography>
                <Typography variant="caption" color="text.secondary">Acertos</Typography>
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700} color="error.main">{resultado.total - resultado.acertos}</Typography>
                <Typography variant="caption" color="text.secondary">Erros</Typography>
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700}>{formatTempo(resultado.tempoGasto)}</Typography>
                <Typography variant="caption" color="text.secondary">Tempo</Typography>
              </Box>
            </Stack>

            <Chip
              label={aprovado ? 'Aprovado ✓' : 'Abaixo da média — revise o conteúdo'}
              color={aprovado ? 'success' : 'warning'}
              size="medium"
            />
          </Stack>
        </CardContent>
      </Card>

      <Button variant="outlined" startIcon={<Assignment />} onClick={onVoltar} fullWidth>
        Voltar aos Simulados
      </Button>
    </Box>
  );
}

// ─── Página principal ─────────────────────────────────────
export function Simulados() {
  const [tela, setTela] = useState<'lista' | 'fazendo' | 'concluido'>('lista');
  const [simulados, setSimulados] = useState<Simulado[]>([]);
  const [jaFeitos, setJaFeitos] = useState<Set<string>>(new Set());
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [simuladoAtivo, setSimuladoAtivo] = useState<Simulado | null>(null);
  const [exercicios, setExercicios] = useState<Exercicio[]>([]);
  const [carregandoEx, setCarregandoEx] = useState(false);
  const [erroEx, setErroEx] = useState<string | null>(null);

  const [resultadoImediato, setResultadoImediato] = useState<ResultadoImediato | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const [{ data: sims }, { data: resultados }] = await Promise.all([
        axios.get<Simulado[]>(`${BASE_URL}/simulados`, auth()),
        axios.get<{ simulado_id: string }[]>(`${BASE_URL}/resultados/me`, auth()),
      ]);
      setSimulados(sims.filter(s => s.ativo));
      setJaFeitos(new Set(resultados.map(r => r.simulado_id)));
    } catch {
      setErro('Erro ao carregar simulados. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const handleIniciar = async (s: Simulado) => {
    setSimuladoAtivo(s);
    setCarregandoEx(true);
    setErroEx(null);
    try {
      const { data } = await axios.get<Exercicio[]>(`${BASE_URL}/simulados/${s.id}/exercicios`, auth());
      setExercicios(data);
      setTela('fazendo');
    } catch {
      setErroEx('Erro ao carregar as questões. Tente novamente.');
      setSimuladoAtivo(null);
    } finally {
      setCarregandoEx(false);
    }
  };

  const handleConcluir = (r: ResultadoImediato) => {
    setResultadoImediato(r);
    setTela('concluido');
    if (simuladoAtivo) {
      setJaFeitos(prev => new Set([...prev, simuladoAtivo.id]));
    }
  };

  const handleVoltar = () => {
    setTela('lista');
    setSimuladoAtivo(null);
    setExercicios([]);
    setResultadoImediato(null);
  };

  return (
    <Box>
      {tela === 'lista' && (
        <>
          <Typography variant="h4" fontWeight={600} gutterBottom>Simulados Disponíveis</Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>
            Teste seus conhecimentos com simulados completos.
          </Typography>
          {erroEx && <Alert severity="error" sx={{ mb: 2 }}>{erroEx}</Alert>}
          {carregandoEx && <LinearProgress sx={{ mb: 2 }} />}
          <ListaSimulados
            simulados={simulados}
            jaFeitos={jaFeitos}
            carregando={carregando}
            erro={erro}
            onIniciar={handleIniciar}
          />
        </>
      )}

      {tela === 'fazendo' && simuladoAtivo && (
        <FazendoSimulado
          simulado={simuladoAtivo}
          exercicios={exercicios}
          onConcluir={handleConcluir}
        />
      )}

      {tela === 'concluido' && resultadoImediato && simuladoAtivo && (
        <ResultadoImediato
          resultado={resultadoImediato}
          simulado={simuladoAtivo}
          onVoltar={handleVoltar}
        />
      )}
    </Box>
  );
}
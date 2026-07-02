import { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Stack,
  TextField, MenuItem, Select, FormControl, InputLabel,
  CircularProgress, Alert, IconButton, Tooltip, Chip,
  Divider, Radio, RadioGroup, FormControlLabel, ToggleButton, ToggleButtonGroup,
  FormHelperText,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

interface Aula { id: string; nome: string; }
interface Modulo { id: string; nome: string; aula: Aula[]; }
interface Disciplina { id: string; nome: string; modulos: Modulo[]; }
interface Simulado { id: string; titulo: string; }

type Vinculo = 'aula' | 'simulado' | 'ambos';

const dificuldades = ['FACIL', 'MEDIO', 'DIFICIL'];
const alternativaVazia = () => ({ texto: '', correta: false });

// ── Schema Yup ────────────────────────────────────────────
const schema = yup.object({
  enunciado: yup
    .string()
    .min(10, 'Enunciado deve ter no mínimo 10 caracteres')
    .required('Enunciado é obrigatório'),
  dificuldade: yup
    .string()
    .oneOf(['FACIL', 'MEDIO', 'DIFICIL'], 'Selecione uma dificuldade válida')
    .required('Dificuldade é obrigatória'),
}).required();

type FormExercicio = { enunciado: string; dificuldade: string };

export function CriarExercicio() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [simulados, setSimulados] = useState<Simulado[]>([]);
  const [loadingInicial, setLoadingInicial] = useState(true);

  // Vínculo
  const [vinculo, setVinculo] = useState<Vinculo>('aula');
  const [disciplinaId, setDisciplinaId] = useState('');
  const [moduloId, setModuloId] = useState('');
  const [aulaId, setAulaId] = useState('');
  const [simuladoId, setSimuladoId] = useState('');

  // Erros de vínculo (não tratados pelo Yup pois são selects dinâmicos)
  const [erroVinculo, setErroVinculo] = useState<string | null>(null);

  // Alternativas
  const [alternativas, setAlternativas] = useState([alternativaVazia(), alternativaVazia()]);
  const [corretaIdx, setCorretaIdx] = useState<number | null>(null);
  const [errosAlternativas, setErrosAlternativas] = useState<string[]>([]);
  const [erroCorreta, setErroCorreta] = useState<string | null>(null);

  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erroApi, setErroApi] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormExercicio>({ resolver: yupResolver(schema) });

  const token = () => localStorage.getItem('token') ?? '';

  useEffect(() => {
    Promise.all([
      axios.get(`${BASE_URL}/disciplinas`, { headers: { Authorization: `Bearer ${token()}` } }).then(r => r.data),
      axios.get(`${BASE_URL}/simulados`, { headers: { Authorization: `Bearer ${token()}` } }).then(r => r.data),
    ])
      .then(([d, s]) => { setDisciplinas(d); setSimulados(s); })
      .finally(() => setLoadingInicial(false));
  }, []);

  const modulosDaDisciplina = disciplinas.find(d => d.id === disciplinaId)?.modulos ?? [];
  const aulasDoModulo = modulosDaDisciplina.find(m => m.id === moduloId)?.aula ?? [];

  const handleAddAlternativa = () => {
    if (alternativas.length >= 5) return;
    setAlternativas(a => [...a, alternativaVazia()]);
  };

  const handleRemoveAlternativa = (idx: number) => {
    if (alternativas.length <= 2) return;
    setAlternativas(a => a.filter((_, i) => i !== idx));
    if (corretaIdx === idx) setCorretaIdx(null);
    else if (corretaIdx !== null && corretaIdx > idx) setCorretaIdx(corretaIdx - 1);
  };

  // Validação manual para vínculo e alternativas (fora do schema)
  const validarExtras = (): boolean => {
    let ok = true;

    // Vínculo
    const vinculoOk =
      (vinculo === 'aula' && !!aulaId) ||
      (vinculo === 'simulado' && !!simuladoId) ||
      (vinculo === 'ambos' && !!aulaId && !!simuladoId);
    if (!vinculoOk) {
      setErroVinculo('Selecione todos os campos de vínculo obrigatórios.');
      ok = false;
    } else {
      setErroVinculo(null);
    }

    // Textos das alternativas
    const novosErros = alternativas.map((alt, i) =>
      !alt.texto.trim() ? `Alternativa ${String.fromCharCode(65 + i)} não pode estar vazia` : ''
    );
    setErrosAlternativas(novosErros);
    if (novosErros.some(e => e)) ok = false;

    // Alternativa correta
    if (corretaIdx === null) {
      setErroCorreta('Marque qual é a alternativa correta.');
      ok = false;
    } else {
      setErroCorreta(null);
    }

    return ok;
  };

  const onSubmit = async (data: FormExercicio) => {
    if (!validarExtras()) return;

    setSalvando(true);
    setErroApi(null);
    setSucesso(false);

    try {
      const body: Record<string, string> = { enunciado: data.enunciado.trim(), dificuldade: data.dificuldade };
      if (vinculo === 'aula' || vinculo === 'ambos') body.aula_id = aulaId;
      if (vinculo === 'simulado' || vinculo === 'ambos') body.simulado_id = simuladoId;

      const resEx = await axios.post(`${BASE_URL}/exercicios`, body, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const exercicio = resEx.data;

      await Promise.all(
        alternativas.map((alt, idx) =>
          axios.post(`${BASE_URL}/alternativas/exercicio/${exercicio.id}`, {
            texto: alt.texto.trim(), correta: idx === corretaIdx,
          }, {
            headers: { Authorization: `Bearer ${token()}` },
          })
        )
      );

      // Limpa tudo
      reset();
      setAulaId(''); setModuloId(''); setDisciplinaId(''); setSimuladoId('');
      setAlternativas([alternativaVazia(), alternativaVazia()]);
      setCorretaIdx(null);
      setErrosAlternativas([]);
      setErroCorreta(null);
      setErroVinculo(null);
      setSucesso(true);
    } catch (e: any) {
      const mensagem = axios.isAxiosError(e) ? e.response?.data?.message : null;
      setErroApi(mensagem ?? e.message ?? 'Erro inesperado.');
    } finally {
      setSalvando(false);
    }
  };

  if (loadingInicial) return (
    <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>
  );

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>Criar Exercício</Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Crie exercícios de fixação vinculados a uma aula, a um simulado, ou a ambos.
      </Typography>

      <Card>
        <CardContent>
          <Stack spacing={3}>

            {/* ── 1. Vínculo ── */}
            <Typography variant="h6" fontWeight={600}>1. Vínculo</Typography>
            <ToggleButtonGroup
              value={vinculo} exclusive size="small"
              onChange={(_, v) => {
                if (v) {
                  setVinculo(v);
                  setAulaId(''); setModuloId(''); setDisciplinaId(''); setSimuladoId('');
                  setErroVinculo(null);
                }
              }}
            >
              <ToggleButton value="aula">Aula</ToggleButton>
              <ToggleButton value="simulado">Simulado</ToggleButton>
              <ToggleButton value="ambos">Ambos</ToggleButton>
            </ToggleButtonGroup>

            {(vinculo === 'aula' || vinculo === 'ambos') && (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormControl fullWidth error={!!erroVinculo}>
                  <InputLabel>Disciplina</InputLabel>
                  <Select value={disciplinaId} label="Disciplina" onChange={(e) => {
                    setDisciplinaId(e.target.value); setModuloId(''); setAulaId('');
                  }}>
                    {disciplinas.map(d => <MenuItem key={d.id} value={d.id}>{d.nome}</MenuItem>)}
                  </Select>
                </FormControl>
                <FormControl fullWidth disabled={!disciplinaId} error={!!erroVinculo}>
                  <InputLabel>Módulo</InputLabel>
                  <Select value={moduloId} label="Módulo" onChange={(e) => { setModuloId(e.target.value); setAulaId(''); }}>
                    {modulosDaDisciplina.map(m => <MenuItem key={m.id} value={m.id}>{m.nome}</MenuItem>)}
                  </Select>
                </FormControl>
                <FormControl fullWidth disabled={!moduloId} error={!!erroVinculo}>
                  <InputLabel>Aula</InputLabel>
                  <Select value={aulaId} label="Aula" onChange={(e) => setAulaId(e.target.value)}>
                    {aulasDoModulo.map(a => <MenuItem key={a.id} value={a.id}>{a.nome}</MenuItem>)}
                  </Select>
                </FormControl>
              </Stack>
            )}

            {(vinculo === 'simulado' || vinculo === 'ambos') && (
              <FormControl fullWidth sx={{ maxWidth: 400 }} error={!!erroVinculo}>
                <InputLabel>Simulado</InputLabel>
                <Select value={simuladoId} label="Simulado" onChange={(e) => setSimuladoId(e.target.value)}>
                  {simulados.map(s => <MenuItem key={s.id} value={s.id}>{s.titulo}</MenuItem>)}
                </Select>
              </FormControl>
            )}

            {erroVinculo && <FormHelperText error>{erroVinculo}</FormHelperText>}

            <Divider />

            {/* ── 2. Enunciado ── */}
            <Typography variant="h6" fontWeight={600}>2. Enunciado</Typography>
            <TextField
              label="Enunciado da questão" fullWidth multiline rows={3}
              {...register('enunciado')}
              error={!!errors.enunciado}
              helperText={errors.enunciado?.message ?? ' '}
            />

            <Controller
              name="dificuldade"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <FormControl sx={{ maxWidth: 200 }} error={!!errors.dificuldade}>
                  <InputLabel>Dificuldade</InputLabel>
                  <Select {...field} label="Dificuldade">
                    {dificuldades.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                  </Select>
                  {errors.dificuldade && (
                    <FormHelperText>{errors.dificuldade.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <Divider />

            {/* ── 3. Alternativas ── */}
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h6" fontWeight={600}>3. Alternativas</Typography>
              <Tooltip title={alternativas.length >= 5 ? 'Máximo de 5 alternativas' : 'Adicionar alternativa'}>
                <span>
                  <Button size="small" variant="outlined" startIcon={<Add />}
                    onClick={handleAddAlternativa} disabled={alternativas.length >= 5}>
                    Adicionar
                  </Button>
                </span>
              </Tooltip>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              Selecione o círculo à esquerda para marcar a alternativa correta.
            </Typography>

            <RadioGroup value={corretaIdx ?? ''} onChange={(e) => { setCorretaIdx(Number(e.target.value)); setErroCorreta(null); }}>
              <Stack spacing={2}>
                {alternativas.map((alt, idx) => (
                  <Stack key={idx} direction="column" spacing={0.5}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <FormControlLabel value={idx} control={<Radio />} label="" sx={{ m: 0 }} />
                      <TextField
                        fullWidth size="small"
                        label={`Alternativa ${String.fromCharCode(65 + idx)}`}
                        value={alt.texto}
                        error={!!errosAlternativas[idx]}
                        onChange={(e) => {
                          setAlternativas(a => a.map((x, i) => i === idx ? { ...x, texto: e.target.value } : x));
                          setErrosAlternativas(prev => prev.map((err, i) => i === idx ? '' : err));
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': corretaIdx === idx
                            ? { '& fieldset': { borderColor: 'success.main', borderWidth: 2 } }
                            : {},
                        }}
                      />
                      {corretaIdx === idx && <Chip label="Correta" color="success" size="small" sx={{ minWidth: 64 }} />}
                      <Tooltip title={alternativas.length <= 2 ? 'Mínimo de 2 alternativas' : 'Remover'}>
                        <span>
                          <IconButton size="small" color="error"
                            onClick={() => handleRemoveAlternativa(idx)} disabled={alternativas.length <= 2}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Stack>
                    {errosAlternativas[idx] && (
                      <FormHelperText error sx={{ ml: 6 }}>{errosAlternativas[idx]}</FormHelperText>
                    )}
                  </Stack>
                ))}
              </Stack>
            </RadioGroup>

            {erroCorreta && <Alert severity="warning">{erroCorreta}</Alert>}
            <Divider />

            {sucesso && <Alert severity="success" onClose={() => setSucesso(false)}>Exercício criado com sucesso!</Alert>}
            {erroApi && <Alert severity="error" onClose={() => setErroApi(null)}>{erroApi}</Alert>}

            <Button variant="contained" size="large" onClick={handleSubmit(onSubmit)} disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar Exercício'}
            </Button>

          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

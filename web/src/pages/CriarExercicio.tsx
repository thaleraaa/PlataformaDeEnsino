import { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Stack,
  TextField, MenuItem, Select, FormControl, InputLabel,
  CircularProgress, Alert, IconButton, Tooltip, Chip,
  Divider, Radio, RadioGroup, FormControlLabel, ToggleButton, ToggleButtonGroup,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

const BASE_URL = 'http://localhost:3000';

interface Aula { id: string; nome: string; }
interface Modulo { id: string; nome: string; aula: Aula[]; }
interface Disciplina { id: string; nome: string; modulos: Modulo[]; }
interface Simulado { id: string; titulo: string; }

type Vinculo = 'aula' | 'simulado' | 'ambos';

const dificuldades = ['FACIL', 'MEDIO', 'DIFICIL'];
const alternativaVazia = () => ({ texto: '', correta: false });

export function CriarExercicio() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [simulados, setSimulados] = useState<Simulado[]>([]);
  const [loadingInicial, setLoadingInicial] = useState(true);

  // Vínculo
  const [vinculo, setVinculo] = useState<Vinculo>('aula');

  // Seleção aula
  const [disciplinaId, setDisciplinaId] = useState('');
  const [moduloId, setModuloId] = useState('');
  const [aulaId, setAulaId] = useState('');

  // Seleção simulado
  const [simuladoId, setSimuladoId] = useState('');

  // Exercício
  const [enunciado, setEnunciado] = useState('');
  const [dificuldade, setDificuldade] = useState('');
  const [alternativas, setAlternativas] = useState([alternativaVazia(), alternativaVazia()]);
  const [corretaIdx, setCorretaIdx] = useState<number | null>(null);

  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const token = () => localStorage.getItem('token') ?? '';

  useEffect(() => {
    Promise.all([
      fetch(`${BASE_URL}/disciplinas`, { headers: { Authorization: `Bearer ${token()}` } }).then(r => r.json()),
      fetch(`${BASE_URL}/simulados`, { headers: { Authorization: `Bearer ${token()}` } }).then(r => r.json()),
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

  const vinculoValido =
    (vinculo === 'aula' && !!aulaId) ||
    (vinculo === 'simulado' && !!simuladoId) ||
    (vinculo === 'ambos' && !!aulaId && !!simuladoId);

  const podeEnviar =
    vinculoValido &&
    enunciado.trim() &&
    dificuldade &&
    corretaIdx !== null &&
    alternativas.every(a => a.texto.trim());

  const handleSalvar = async () => {
    if (!podeEnviar) return;
    setSalvando(true);
    setErro(null);
    setSucesso(false);
    try {
      const body: Record<string, string> = { enunciado: enunciado.trim(), dificuldade };
      if (vinculo === 'aula' || vinculo === 'ambos') body.aula_id = aulaId;
      if (vinculo === 'simulado' || vinculo === 'ambos') body.simulado_id = simuladoId;

      const resEx = await fetch(`${BASE_URL}/exercicios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify(body),
      });
      if (!resEx.ok) throw new Error('Erro ao criar exercício.');
      const exercicio = await resEx.json();

      await Promise.all(
        alternativas.map((alt, idx) =>
          fetch(`${BASE_URL}/alternativas/exercicio/${exercicio.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
            body: JSON.stringify({ texto: alt.texto.trim(), correta: idx === corretaIdx }),
          })
        )
      );

      // Limpa formulário
      setEnunciado(''); setDificuldade('');
      setAulaId(''); setModuloId(''); setDisciplinaId('');
      setSimuladoId('');
      setAlternativas([alternativaVazia(), alternativaVazia()]);
      setCorretaIdx(null);
      setSucesso(true);
    } catch (e: any) {
      setErro(e.message ?? 'Erro inesperado.');
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
              value={vinculo}
              exclusive
              onChange={(_, v) => { if (v) { setVinculo(v); setAulaId(''); setModuloId(''); setDisciplinaId(''); setSimuladoId(''); } }}
              size="small"
            >
              <ToggleButton value="aula">Aula</ToggleButton>
              <ToggleButton value="simulado">Simulado</ToggleButton>
              <ToggleButton value="ambos">Ambos</ToggleButton>
            </ToggleButtonGroup>

            {/* Seleção de aula */}
            {(vinculo === 'aula' || vinculo === 'ambos') && (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>Disciplina</InputLabel>
                  <Select value={disciplinaId} label="Disciplina" onChange={(e) => {
                    setDisciplinaId(e.target.value); setModuloId(''); setAulaId('');
                  }}>
                    {disciplinas.map(d => <MenuItem key={d.id} value={d.id}>{d.nome}</MenuItem>)}
                  </Select>
                </FormControl>
                <FormControl fullWidth disabled={!disciplinaId}>
                  <InputLabel>Módulo</InputLabel>
                  <Select value={moduloId} label="Módulo" onChange={(e) => { setModuloId(e.target.value); setAulaId(''); }}>
                    {modulosDaDisciplina.map(m => <MenuItem key={m.id} value={m.id}>{m.nome}</MenuItem>)}
                  </Select>
                </FormControl>
                <FormControl fullWidth disabled={!moduloId}>
                  <InputLabel>Aula</InputLabel>
                  <Select value={aulaId} label="Aula" onChange={(e) => setAulaId(e.target.value)}>
                    {aulasDoModulo.map(a => <MenuItem key={a.id} value={a.id}>{a.nome}</MenuItem>)}
                  </Select>
                </FormControl>
              </Stack>
            )}

            {/* Seleção de simulado */}
            {(vinculo === 'simulado' || vinculo === 'ambos') && (
              <FormControl fullWidth sx={{ maxWidth: 400 }}>
                <InputLabel>Simulado</InputLabel>
                <Select value={simuladoId} label="Simulado" onChange={(e) => setSimuladoId(e.target.value)}>
                  {simulados.map(s => <MenuItem key={s.id} value={s.id}>{s.titulo}</MenuItem>)}
                </Select>
              </FormControl>
            )}

            <Divider />

            {/* ── 2. Enunciado ── */}
            <Typography variant="h6" fontWeight={600}>2. Enunciado</Typography>
            <TextField
              label="Enunciado da questão" fullWidth multiline rows={3}
              value={enunciado} onChange={(e) => setEnunciado(e.target.value)}
            />
            <FormControl sx={{ maxWidth: 200 }}>
              <InputLabel>Dificuldade</InputLabel>
              <Select value={dificuldade} label="Dificuldade" onChange={(e) => setDificuldade(e.target.value)}>
                {dificuldades.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
              </Select>
            </FormControl>

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

            <RadioGroup value={corretaIdx ?? ''} onChange={(e) => setCorretaIdx(Number(e.target.value))}>
              <Stack spacing={2}>
                {alternativas.map((alt, idx) => (
                  <Stack key={idx} direction="row" alignItems="center" spacing={1}>
                    <FormControlLabel value={idx} control={<Radio />} label="" sx={{ m: 0 }} />
                    <TextField
                      fullWidth size="small"
                      label={`Alternativa ${String.fromCharCode(65 + idx)}`}
                      value={alt.texto}
                      onChange={(e) => setAlternativas(a => a.map((x, i) => i === idx ? { ...x, texto: e.target.value } : x))}
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
                ))}
              </Stack>
            </RadioGroup>

            <Divider />

            {sucesso && <Alert severity="success" onClose={() => setSucesso(false)}>Exercício criado com sucesso!</Alert>}
            {erro && <Alert severity="error" onClose={() => setErro(null)}>{erro}</Alert>}

            <Button variant="contained" size="large" onClick={handleSalvar} disabled={!podeEnviar || salvando}>
              {salvando ? 'Salvando...' : 'Salvar Exercício'}
            </Button>

          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
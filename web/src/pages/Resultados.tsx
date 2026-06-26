import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Card, CardContent, Stack, Chip,
  CircularProgress, Alert, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, LinearProgress, Grid,
} from '@mui/material';
import { TrendingUp, Assessment, CheckCircle, Warning } from '@mui/icons-material';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';
const auth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token') ?? ''}` } });

interface Resultado {
  id: string;
  nota: number;
  tempoSegundos: number;
  dataRealizacao: string;
  simulado_id: string;
}

interface Simulado {
  id: string;
  titulo: string;
}

const formatTempo = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  if (h > 0) return `${h}h ${m}min`;
  return `${m}min ${String(ss).padStart(2, '0')}s`;
};

export function Resultados() {
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [simuladosMap, setSimuladosMap] = useState<Record<string, string>>({});
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const { data: res } = await axios.get<Resultado[]>(`${BASE_URL}/resultados/me`, auth());
      setResultados(res);

      // Buscar título de cada simulado único
      const ids = [...new Set(res.map(r => r.simulado_id))];
      const entries = await Promise.all(
        ids.map(async (id) => {
          try {
            const { data } = await axios.get<Simulado>(`${BASE_URL}/simulados/${id}`, auth());
            return [id, data.titulo] as [string, string];
          } catch {
            return [id, 'Simulado'] as [string, string];
          }
        })
      );
      setSimuladosMap(Object.fromEntries(entries));
    } catch {
      setErro('Erro ao carregar resultados.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const media = resultados.length > 0
    ? resultados.reduce((acc, r) => acc + r.nota, 0) / resultados.length
    : 0;

  const melhorNota = resultados.length > 0
    ? Math.max(...resultados.map(r => r.nota))
    : 0;

  if (carregando) return <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>;
  if (erro) return <Alert severity="error">{erro}</Alert>;

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>Meus Resultados</Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Acompanhe seu desempenho nos simulados realizados.
      </Typography>

      {resultados.length === 0 ? (
        <Box textAlign="center" mt={8}>
          <Assessment sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography color="text.secondary">Você ainda não realizou nenhum simulado.</Typography>
        </Box>
      ) : (
        <>
          {/* Cards de resumo */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Assessment sx={{ fontSize: 44, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Média Geral</Typography>
                      <Typography variant="h3" fontWeight={700} color={media >= 7 ? 'success.main' : 'warning.main'}>
                        {media.toFixed(1)}
                      </Typography>
                    </Box>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={media * 10}
                    color={media >= 7 ? 'success' : 'warning'}
                    sx={{ mt: 2, height: 6, borderRadius: 3 }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <TrendingUp sx={{ fontSize: 44, color: 'secondary.main' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Simulados Realizados</Typography>
                      <Typography variant="h3" fontWeight={700}>{resultados.length}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <CheckCircle sx={{ fontSize: 44, color: 'success.main' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Melhor Nota</Typography>
                      <Typography variant="h3" fontWeight={700} color="success.main">
                        {melhorNota.toFixed(1)}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Tabela histórico */}
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={3}>Histórico de Simulados</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Simulado</TableCell>
                      <TableCell>Data</TableCell>
                      <TableCell>Tempo</TableCell>
                      <TableCell align="center">Nota</TableCell>
                      <TableCell align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[...resultados]
                      .sort((a, b) => new Date(b.dataRealizacao).getTime() - new Date(a.dataRealizacao).getTime())
                      .map((r) => (
                        <TableRow key={r.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>
                              {simuladosMap[r.simulado_id] ?? 'Simulado'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {new Date(r.dataRealizacao).toLocaleDateString('pt-BR', {
                              day: '2-digit', month: 'long', year: 'numeric',
                            })}
                          </TableCell>
                          <TableCell>{formatTempo(r.tempoSegundos)}</TableCell>
                          <TableCell align="center">
                            <Typography
                              variant="h6" fontWeight={700}
                              color={r.nota >= 7 ? 'success.main' : r.nota >= 5 ? 'warning.main' : 'error.main'}
                            >
                              {r.nota.toFixed(1)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              icon={r.nota >= 7 ? <CheckCircle /> : <Warning />}
                              label={r.nota >= 7 ? 'Aprovado' : 'Revisar'}
                              color={r.nota >= 7 ? 'success' : 'warning'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
}
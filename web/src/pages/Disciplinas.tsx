import { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button,
  LinearProgress, Stack, Chip, Accordion, AccordionSummary,
  AccordionDetails, CircularProgress, Alert,
} from '@mui/material';
import { ExpandMore, PlayCircle, School } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Mesmas interfaces do mockData — só pra tipar a resposta da API
interface Aula { id: string; nome: string; videoAula: string; texto: string; modulo_id: string; }
interface Modulo { id: string; nome: string; aula: Aula[]; }
interface Disciplina { id: string; nome: string; modulos: Modulo[]; }
interface Progresso { disciplina_id: string; porcentagemConcluida: number; }

const BASE_URL = 'http://localhost:3000';

export function Disciplinas() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | false>(false);

  // Estados pra controlar os dados, loading e erro
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [progressos, setProgressos] = useState<Progresso[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Busca disciplinas e progressos ao mesmo tempo
    Promise.all([
      axios.get(`${BASE_URL}/disciplinas`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.data),

      axios.get(`${BASE_URL}/progressos/me`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.data),
    ])
      .then(([disciplinasData, progressosData]) => {
        setDisciplinas(disciplinasData);
        setProgressos(progressosData);
      })
      .catch(() => setErro('Erro ao carregar disciplinas. Tente novamente.'))
      .finally(() => setLoading(false));
  }, []); // [] = roda só uma vez quando o componente abre

  const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Tela de loading
  if (loading) return (
    <Box display="flex" justifyContent="center" mt={8}>
      <CircularProgress />
    </Box>
  );

  // Tela de erro
  if (erro) return (
    <Alert severity="error" sx={{ mt: 4 }}>{erro}</Alert>
  );

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Minhas Disciplinas
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Explore o conteúdo das suas disciplinas e acompanhe seu progresso.
      </Typography>

      <Grid container spacing={3}>
        {disciplinas.map((disciplina) => {
          // Mesma lógica de antes, só que com dados reais
          const progresso = progressos.find((p) => p.disciplina_id === disciplina.id);
          const totalAulas = disciplina.modulos.reduce(
            (acc, modulo) => acc + modulo.aula.length, 0
          );

          return (
            <Grid item xs={12} key={disciplina.id}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                    <School sx={{ fontSize: 32, color: 'primary.main' }} />
                    <Box flex={1}>
                      <Typography variant="h6" fontWeight={600}>
                        {disciplina.nome}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {disciplina.modulos.length} módulos • {totalAulas} aula
                      </Typography>
                    </Box>
                    <Box textAlign="right">
                      <Typography variant="h6" color="primary.main">
                        {progresso?.porcentagemConcluida || 0}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Concluído
                      </Typography>
                    </Box>
                  </Stack>

                  <LinearProgress
                    variant="determinate"
                    value={progresso?.porcentagemConcluida || 0}
                    sx={{ mb: 3, height: 6, borderRadius: 3 }}
                  />

                  {disciplina.modulos.map((modulo) => (
                    <Accordion
                      key={modulo.id}
                      expanded={expanded === modulo.id}
                      onChange={handleChange(modulo.id)}
                      sx={{ bgcolor: 'background.default', mb: 1 }}
                    >
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography fontWeight={500}>{modulo.nome}</Typography>
                          <Chip label={`${modulo.aula.length} aulas`} size="small" />
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Stack spacing={1}>
                          {modulo.aula.map((aula) => (
                            <Box
                              key={aula.id}
                              sx={{
                                p: 2,
                                bgcolor: 'background.paper',
                                borderRadius: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <PlayCircle sx={{ color: 'primary.main' }} />
                                <Typography variant="body2">{aula.nome}</Typography>
                              </Stack>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => navigate(`/aula/${aula.id}`)}
                              >
                                Acessar
                              </Button>
                            </Box>
                          ))}
                        </Stack>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
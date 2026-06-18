import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Alert,
  Chip,
  CircularProgress,
} from '@mui/material';
import { ArrowBack, CheckCircle } from '@mui/icons-material';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

interface Alternativa { id: string; texto: string; correta: boolean; }
interface Exercicio { id: string; enunciado: string; dificuldade: string; aula_id: string; alternativa: Alternativa[]; }
interface AulaDetalhe {
  id: string;
  nome: string;
  videoAula: string;
  texto: string;
  modulo: { nome: string; disciplina: { nome: string } };
  exercicio: Exercicio[];
}

export function Aula() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [aula, setAula] = useState<AulaDetalhe | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [mostrarResultados, setMostrarResultados] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${BASE_URL}/aulas/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => { console.log('aula:', JSON.stringify(res.data, null, 2)); setAula(res.data); })
      .catch(() => setErro('Aula não encontrada.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <Box display="flex" justifyContent="center" mt={8}>
      <CircularProgress />
    </Box>
  );

  if (erro || !aula) return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/disciplinas')} sx={{ mb: 3 }}>
        Voltar para Disciplinas
      </Button>
      <Typography>{erro ?? 'Aula não encontrada'}</Typography>
    </Box>
  );

  const exerciciosAula = aula.exercicio;

  const handleSubmit = () => setMostrarResultados(true);

  const calcularNota = () => {
    let corretas = 0;
    exerciciosAula.forEach((exercicio) => {
      const respostaSelecionada = respostas[exercicio.id];
      const alternativaCorreta = exercicio.alternativa.find((a) => a.correta);
      if (respostaSelecionada === alternativaCorreta?.id) corretas++;
    });
    return (corretas / exerciciosAula.length) * 10;
  };

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/disciplinas')}
        sx={{ mb: 3 }}
      >
        Voltar para Disciplinas
      </Button>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack spacing={1} mb={3}>
            <Typography variant="overline" color="text.secondary">
              {aula.modulo.disciplina.nome} / {aula.modulo.nome}
            </Typography>
            <Typography variant="h4" fontWeight={600}>
              {aula.nome}
            </Typography>
          </Stack>

          <Box
            sx={{
              position: 'relative',
              paddingBottom: '56.25%',
              height: 0,
              overflow: 'hidden',
              borderRadius: 2,
              bgcolor: 'background.default',
              mb: 3,
            }}
          >
            <iframe
              src={aula.videoAula}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 0,
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Box>

          <Typography variant="h6" fontWeight={600} gutterBottom>
            Sobre esta aula
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {aula.texto}
          </Typography>
        </CardContent>
      </Card>

      {exerciciosAula.length > 0 && (
        <Card>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <CheckCircle sx={{ fontSize: 32, color: 'primary.main' }} />
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Exercícios de Fixação
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {exerciciosAula.length} questões
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            <Stack spacing={4}>
              {exerciciosAula.map((exercicio, index) => (
                <Box key={exercicio.id}>
                  <Stack direction="row" alignItems="flex-start" spacing={2} mb={2}>
                    <Chip label={`Q${index + 1}`} color="primary" size="small" />
                    <Box flex={1}>
                      <Typography variant="body1" fontWeight={500} gutterBottom>
                        {exercicio.enunciado}
                      </Typography>
                      <Chip label={exercicio.dificuldade} size="small" variant="outlined" />
                    </Box>
                  </Stack>

                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup
                      value={respostas[exercicio.id] || ''}
                      onChange={(e) =>
                        setRespostas({ ...respostas, [exercicio.id]: e.target.value })
                      }
                    >
                      {exercicio.alternativa.map((alternativa) => {
                        const isCorreta = alternativa.correta;
                        const isSelecionada = respostas[exercicio.id] === alternativa.id;
                        let color: 'success' | 'error' | 'default' = 'default';

                        if (mostrarResultados) {
                          if (isCorreta) color = 'success';
                          else if (isSelecionada && !isCorreta) color = 'error';
                        }

                        return (
                          <FormControlLabel
                            key={alternativa.id}
                            value={alternativa.id}
                            control={<Radio />}
                            label={alternativa.texto}
                            disabled={mostrarResultados}
                            sx={{
                              p: 1.5,
                              m: 0,
                              mb: 1,
                              borderRadius: 1,
                              border: '1px solid',
                              borderColor:
                                color === 'success' ? 'success.main' :
                                color === 'error' ? 'error.main' : 'divider',
                              bgcolor:
                                color === 'success' ? 'success.main' :
                                color === 'error' ? 'error.main' : 'transparent',
                              opacity: color === 'success' || color === 'error' ? 0.9 : 1,
                            }}
                          />
                        );
                      })}
                    </RadioGroup>
                  </FormControl>

                  {index < exerciciosAula.length - 1 && <Divider sx={{ mt: 3 }} />}
                </Box>
              ))}
            </Stack>

            {!mostrarResultados ? (
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleSubmit}
                disabled={Object.keys(respostas).length !== exerciciosAula.length}
                sx={{ mt: 4 }}
              >
                Enviar Respostas
              </Button>
            ) : (
              <Alert severity="success" sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Nota: {calcularNota().toFixed(1)}
                </Typography>
                <Typography variant="body2">
                  Você acertou{' '}
                  {exerciciosAula.filter((e) => {
                    const alt = e.alternativa.find((a) => a.correta);
                    return respostas[e.id] === alt?.id;
                  }).length}{' '}
                  de {exerciciosAula.length} questões.
                </Typography>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
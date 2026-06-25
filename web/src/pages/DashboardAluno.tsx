import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Stack,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  School,
  Assignment,
  CheckCircle,
} from '@mui/icons-material';
import { mockDisciplinas, mockProgressos, mockResultados } from '../mockData';

export function DashboardAluno() {
  const totalDisciplinas = mockDisciplinas.length;
  const progressoMedio =
    mockProgressos.reduce((acc, p) => acc + p.porcentagemConcluida, 0) /
    mockProgressos.length;
  const simuladosRealizados = mockResultados.length;
  const mediaNotas =
    mockResultados.reduce((acc, r) => acc + r.nota, 0) / mockResultados.length;

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Dashboard do Aluno
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Bem-vindo de volta! Acompanhe seu progresso acadêmico.
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Disciplinas
                  </Typography>
                  <Typography variant="h4" fontWeight={600}>
                    {totalDisciplinas}
                  </Typography>
                </Box>
                <School sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Progresso Médio
                  </Typography>
                  <Typography variant="h4" fontWeight={600}>
                    {progressoMedio.toFixed(0)}%
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: 'secondary.main', opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Simulados
                  </Typography>
                  <Typography variant="h4" fontWeight={600}>
                    {simuladosRealizados}
                  </Typography>
                </Box>
                <Assignment sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Média Geral
                  </Typography>
                  <Typography variant="h4" fontWeight={600}>
                    {mediaNotas.toFixed(1)}
                  </Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 40, color: 'secondary.main', opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Progresso nas Disciplinas
              </Typography>
              <Stack spacing={3} mt={3}>
                {mockProgressos.map((progresso) => {
                  const disciplina = mockDisciplinas.find(
                    (d) => d.id === progresso.disciplina_id
                  );
                  return (
                    <Box key={progresso.id}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1}
                      >
                        <Typography variant="body2" fontWeight={500}>
                          {disciplina?.nome}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {progresso.porcentagemConcluida}%
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={progresso.porcentagemConcluida}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Últimos Resultados
              </Typography>
              <Stack spacing={2} mt={3}>
                {mockResultados.map((resultado) => (
                  <Box
                    key={resultado.id}
                    sx={{
                      p: 2,
                      bgcolor: 'background.default',
                      borderRadius: 2,
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          Simulado #{resultado.simulado_id}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(resultado.dataRealizacao).toLocaleDateString('pt-BR')}
                        </Typography>
                      </Box>
                      <Chip
                        label={`${resultado.nota.toFixed(1)}`}
                        color={resultado.nota >= 7 ? 'success' : 'warning'}
                        size="small"
                      />
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

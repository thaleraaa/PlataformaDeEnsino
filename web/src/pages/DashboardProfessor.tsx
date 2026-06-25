import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
} from '@mui/material';
import {
  MenuBook,
  Quiz,
  Assignment,
  Groups,
  Add,
} from '@mui/icons-material';
import { mockDisciplinas, mockExercicios, mockSimulados } from '../mockData';

export function DashboardProfessor() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Dashboard do Professor
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Gerencie suas disciplinas, exercícios e acompanhe seus alunos.
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
                    {mockDisciplinas.length}
                  </Typography>
                </Box>
                <MenuBook sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
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
                    Exercícios
                  </Typography>
                  <Typography variant="h4" fontWeight={600}>
                    {mockExercicios.length}
                  </Typography>
                </Box>
                <Quiz sx={{ fontSize: 40, color: 'secondary.main', opacity: 0.3 }} />
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
                    {mockSimulados.length}
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
                    Alunos Ativos
                  </Typography>
                  <Typography variant="h4" fontWeight={600}>
                    42
                  </Typography>
                </Box>
                <Groups sx={{ fontSize: 40, color: 'secondary.main', opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Ações Rápidas
              </Typography>
              <Stack spacing={2} mt={3}>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Criar Nova Aula
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Criar Exercício
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Criar Simulado
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Minhas Disciplinas
              </Typography>
              <Stack spacing={2} mt={3}>
                {mockDisciplinas.map((disciplina) => {
                  const totalAulas = disciplina.modulos.reduce(
                    (acc, m) => acc + m.aulas.length,
                    0
                  );
                  return (
                    <Box
                      key={disciplina.id}
                      sx={{
                        p: 2,
                        bgcolor: 'background.default',
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="body1" fontWeight={500}>
                        {disciplina.nome}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {disciplina.modulos.length} módulos • {totalAulas} aulas
                      </Typography>
                    </Box>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
} from '@mui/material';
import { Assignment, Timer, Quiz } from '@mui/icons-material';
import { mockSimulados } from '../mockData';

export function Simulados() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Simulados Disponíveis
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Teste seus conhecimentos com simulados completos.
      </Typography>

      <Grid container spacing={3}>
        {mockSimulados.map((simulado, index) => (
          <Grid item xs={12} md={6} key={simulado.id}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                  <Assignment sx={{ fontSize: 40, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      Simulado Geral #{index + 1}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avaliação completa
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={2} mb={3}>
                  <Chip
                    icon={<Quiz />}
                    label={`${simulado.quantidadeQuestao} questões`}
                    size="small"
                  />
                  <Chip
                    icon={<Timer />}
                    label={`${simulado.tempoMaximo} min`}
                    size="small"
                  />
                </Stack>

                <Typography variant="body2" color="text.secondary" mb={3}>
                  Este simulado abrange diversos tópicos das disciplinas de medicina.
                  Prepare-se bem antes de iniciar!
                </Typography>

                <Button variant="contained" fullWidth>
                  Iniciar Simulado
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

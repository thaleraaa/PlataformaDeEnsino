import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  LinearProgress,
} from '@mui/material';
import { TrendingUp, Assessment } from '@mui/icons-material';
import { mockResultados } from '../mockData';

export function Resultados() {
  const mediaGeral =
    mockResultados.reduce((acc, r) => acc + r.nota, 0) / mockResultados.length;

  const formatarTempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    return `${horas}h ${minutos}min`;
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Meus Resultados
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Acompanhe seu desempenho nos simulados realizados.
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Assessment sx={{ fontSize: 48, color: 'primary.main' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Média Geral
                  </Typography>
                  <Typography variant="h3" fontWeight={600}>
                    {mediaGeral.toFixed(1)}
                  </Typography>
                </Box>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={mediaGeral * 10}
                sx={{ mt: 2, height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <TrendingUp sx={{ fontSize: 48, color: 'secondary.main' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Simulados Realizados
                  </Typography>
                  <Typography variant="h3" fontWeight={600}>
                    {mockResultados.length}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={3}>
            Histórico de Simulados
          </Typography>

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
                {mockResultados.map((resultado, index) => (
                  <TableRow key={resultado.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        Simulado Geral #{index + 1}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {new Date(resultado.dataRealizacao).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>{formatarTempo(resultado.tempoSegundos)}</TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        color={resultado.nota >= 7 ? 'success.main' : 'warning.main'}
                      >
                        {resultado.nota.toFixed(1)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={resultado.nota >= 7 ? 'Aprovado' : 'Revisar'}
                        color={resultado.nota >= 7 ? 'success' : 'warning'}
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
    </Box>
  );
}

// Import Grid from MUI
import { Grid } from '@mui/material';

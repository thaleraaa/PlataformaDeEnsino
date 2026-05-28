import {
  Box,
  Grid,
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
  Button,
  Avatar,
} from '@mui/material';
import {
  Groups,
  School,
  TrendingUp,
  PersonAdd,
} from '@mui/icons-material';

export function DashboardAdmin() {
  const professores = [
    { id: '1', nome: 'Dr. João Silva', CRM: '123456', disciplinas: 3, ativo: true },
    { id: '2', nome: 'Dra. Maria Oliveira', CRM: '234567', disciplinas: 2, ativo: true },
    { id: '3', nome: 'Dr. Pedro Santos', CRM: '345678', disciplinas: 1, ativo: false },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Dashboard Administrativo
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Gerencie professores e alunos da plataforma.
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total de Professores
                  </Typography>
                  <Typography variant="h4" fontWeight={600}>
                    {professores.length}
                  </Typography>
                </Box>
                <Groups sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
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
                    Total de Alunos
                  </Typography>
                  <Typography variant="h4" fontWeight={600}>
                    156
                  </Typography>
                </Box>
                <School sx={{ fontSize: 40, color: 'secondary.main', opacity: 0.3 }} />
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
                    Professores Ativos
                  </Typography>
                  <Typography variant="h4" fontWeight={600}>
                    {professores.filter((p) => p.ativo).length}
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Button
                variant="contained"
                fullWidth
                startIcon={<PersonAdd />}
                size="large"
              >
                Novo Professor
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={3}>
            Professores Cadastrados
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Professor</TableCell>
                  <TableCell>CRM</TableCell>
                  <TableCell>Disciplinas</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {professores.map((professor) => (
                  <TableRow key={professor.id}>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {professor.nome.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" fontWeight={500}>
                          {professor.nome}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{professor.CRM}</TableCell>
                    <TableCell>{professor.disciplinas} disciplinas</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={professor.ativo ? 'Ativo' : 'Inativo'}
                        color={professor.ativo ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" variant="outlined">
                        Editar
                      </Button>
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

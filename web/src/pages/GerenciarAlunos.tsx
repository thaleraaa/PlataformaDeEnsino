import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Stack,
  CircularProgress,
  InputBase,
  Paper,
  Divider,
} from '@mui/material';
import {
  Search,
  School,
  TrendingUp,
} from '@mui/icons-material';
import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';

interface Aluno {
  id: string;
  nome: string;
  email: string;
  periodo: string;
  faculdade: string;
}

const BASE_URL = 'http://localhost:3000';

export function GerenciarAlunos() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loadingDados, setLoadingDados] = useState(true);
  const [erroDados, setErroDados] = useState<string | null>(null);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    const fetchAlunos = async () => {
      setLoadingDados(true);
      setErroDados(null);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${BASE_URL}/alunos`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = res.data;

        const lista: Aluno[] = data.map((a: any) => ({
          id: String(a.id),
          nome: a.conta?.nome ?? a.nome ?? '—',
          email: a.conta?.email ?? a.email ?? '—',
          periodo: a.periodo ?? '—',
          faculdade: a.faculdade ?? '—',
        }));

        setAlunos(lista);
      } catch {
        setErroDados('Erro ao conectar com o servidor.');
      } finally {
        setLoadingDados(false);
      }
    };

    fetchAlunos();
  }, []);

  const alunosFiltrados = useMemo(() => {
    if (!busca.trim()) return alunos;
    const termo = busca.toLowerCase();
    return alunos.filter(
      (a) =>
        a.nome.toLowerCase().includes(termo) ||
        a.email.toLowerCase().includes(termo) ||
        a.faculdade.toLowerCase().includes(termo)
    );
  }, [alunos, busca]);

  const totalFaculdades = useMemo(
    () => new Set(alunos.map((a) => a.faculdade)).size,
    [alunos]
  );

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
        <Box>
          <Typography variant="h4" fontWeight={600}>
            Alunos
          </Typography>
          <Typography variant="body1" color="text.secondary" mt={0.5}>
            Visualize todos os alunos cadastrados na plataforma.
          </Typography>
        </Box>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={4} mb={4}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>Total de Alunos</Typography>
                <Typography variant="h4" fontWeight={700}>{alunos.length}</Typography>
              </Box>
              <School sx={{ fontSize: 44, color: 'primary.main', opacity: 0.25 }} />
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>Faculdades Representadas</Typography>
                <Typography variant="h4" fontWeight={700} color="success.main">{totalFaculdades}</Typography>
              </Box>
              <TrendingUp sx={{ fontSize: 44, color: 'success.main', opacity: 0.25 }} />
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <Card>
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
            <Typography variant="h6" fontWeight={600}>Lista de Alunos</Typography>
            <Paper variant="outlined" sx={{ display: 'flex', alignItems: 'center', px: 1.5, py: 0.5, borderRadius: 2, width: 280 }}>
              <Search sx={{ color: 'text.disabled', mr: 1, fontSize: 20 }} />
              <InputBase
                placeholder="Buscar por nome, e-mail ou faculdade..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                sx={{ flex: 1, fontSize: 14 }}
              />
            </Paper>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Aluno</TableCell>
                  <TableCell>E-mail</TableCell>
                  <TableCell>Faculdade</TableCell>
                  <TableCell align="center">Período</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingDados ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={32} />
                    </TableCell>
                  </TableRow>
                ) : erroDados ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                      <Typography color="error">{erroDados}</Typography>
                    </TableCell>
                  </TableRow>
                ) : alunosFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                      <Typography color="text.secondary">
                        {busca ? `Nenhum aluno encontrado para "${busca}".` : 'Nenhum aluno cadastrado.'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  alunosFiltrados.map((aluno) => (
                    <TableRow key={aluno.id} hover>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {aluno.nome.charAt(0)}
                          </Avatar>
                          <Typography variant="body2" fontWeight={500}>{aluno.nome}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">{aluno.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">{aluno.faculdade}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={aluno.periodo} size="small" variant="outlined" />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {!loadingDados && alunosFiltrados.length > 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
              Exibindo {alunosFiltrados.length} de {alunos.length} aluno{alunos.length !== 1 ? 's' : ''}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
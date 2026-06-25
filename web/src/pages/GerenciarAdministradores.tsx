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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  InputBase,
  IconButton,
  Paper,
  Tooltip,
  Divider,
  Alert,
} from '@mui/material';
import {
  Search,
  Block,
  Groups,
  TrendingUp,
  PersonOff,
  WarningAmber,
} from '@mui/icons-material';
import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';

interface Administrador {
  id: string;
  nome: string;
  email: string;
  ativo: boolean;
}

const BASE_URL = 'http://localhost:3000';

export function GerenciarAdministradores() {
  const [administradores, setAdministradores] = useState<Administrador[]>([]);
  const [loadingDados, setLoadingDados] = useState(true);
  const [erroDados, setErroDados] = useState<string | null>(null);
  const [busca, setBusca] = useState('');

  const [admParaDesativar, setAdmParaDesativar] = useState<Administrador | null>(null);
  const [desativando, setDesativando] = useState(false);
  const [erroDesativar, setErroDesativar] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdministradores = async () => {
      setLoadingDados(true);
      setErroDados(null);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${BASE_URL}/administradores`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = res.data;

        const lista: Administrador[] = data.map((a: any) => ({
          id: String(a.id),
          nome: a.conta?.nome ?? a.nome ?? '—',
          email: a.conta?.email ?? a.email ?? '—',
          ativo: a.ativo ?? true,
        }));

        setAdministradores(lista);
      } catch {
        setErroDados('Erro ao conectar com o servidor.');
      } finally {
        setLoadingDados(false);
      }
    };

    fetchAdministradores();
  }, []);

  const administradoresFiltrados = useMemo(() => {
    if (!busca.trim()) return administradores;
    const termo = busca.toLowerCase();
    return administradores.filter(
      (a) =>
        a.nome.toLowerCase().includes(termo) ||
        a.email.toLowerCase().includes(termo)
    );
  }, [administradores, busca]);

  const totalAtivos = administradores.filter((a) => a.ativo).length;
  const totalInativos = administradores.filter((a) => !a.ativo).length;

  const handleAbrirConfirmacao = (adm: Administrador) => {
    setErroDesativar(null);
    setAdmParaDesativar(adm);
  };

  const handleFecharConfirmacao = () => {
    if (desativando) return;
    setAdmParaDesativar(null);
    setErroDesativar(null);
  };

  const handleConfirmarDesativacao = async () => {
    if (!admParaDesativar) return;
    setDesativando(true);
    setErroDesativar(null);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/administradores/${admParaDesativar.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setAdministradores((prev) =>
        prev.map((a) =>
          a.id === admParaDesativar.id ? { ...a, ativo: false } : a
        )
      );
      setAdmParaDesativar(null);
    } catch (err) {
      const mensagem = axios.isAxiosError(err) ? err.response?.data?.message : null;
      setErroDesativar(mensagem || 'Erro ao conectar com o servidor.');
    } finally {
      setDesativando(false);
    }
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
        <Box>
          <Typography variant="h4" fontWeight={600}>
            Administradores
          </Typography>
          <Typography variant="body1" color="text.secondary" mt={0.5}>
            Visualize todos os administradores cadastrados na plataforma.
          </Typography>
        </Box>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={4} mb={4}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>Total de Administradores</Typography>
                <Typography variant="h4" fontWeight={700}>{administradores.length}</Typography>
              </Box>
              <Groups sx={{ fontSize: 44, color: 'primary.main', opacity: 0.25 }} />
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>Administradores Ativos</Typography>
                <Typography variant="h4" fontWeight={700} color="success.main">{totalAtivos}</Typography>
              </Box>
              <TrendingUp sx={{ fontSize: 44, color: 'success.main', opacity: 0.25 }} />
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>Administradores Inativos</Typography>
                <Typography variant="h4" fontWeight={700} color="text.disabled">{totalInativos}</Typography>
              </Box>
              <PersonOff sx={{ fontSize: 44, color: 'text.disabled', opacity: 0.4 }} />
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <Card>
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
            <Typography variant="h6" fontWeight={600}>Lista de Administradores</Typography>
            <Paper variant="outlined" sx={{ display: 'flex', alignItems: 'center', px: 1.5, py: 0.5, borderRadius: 2, width: 280 }}>
              <Search sx={{ color: 'text.disabled', mr: 1, fontSize: 20 }} />
              <InputBase
                placeholder="Buscar por nome ou e-mail..."
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
                  <TableCell>Administrador</TableCell>
                  <TableCell>E-mail</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="right">Ações</TableCell>
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
                ) : administradoresFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                      <Typography color="text.secondary">
                        {busca ? `Nenhum administrador encontrado para "${busca}".` : 'Nenhum administrador cadastrado.'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  administradoresFiltrados.map((administrador) => (
                    <TableRow key={administrador.id} hover>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar sx={{ bgcolor: administrador.ativo ? 'primary.main' : 'action.disabled' }}>
                            {administrador.nome.charAt(0)}
                          </Avatar>
                          <Typography variant="body2" fontWeight={500}>{administrador.nome}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">{administrador.email}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={administrador.ativo ? 'Ativo' : 'Inativo'}
                          color={administrador.ativo ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          <Tooltip title={administrador.ativo ? 'Desativar' : 'Já desativado'}>
                            <span>
                              <IconButton
                                size="small"
                                color="error"
                                disabled={!administrador.ativo}
                                onClick={() => handleAbrirConfirmacao(administrador)}
                              >
                                <Block fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {!loadingDados && administradoresFiltrados.length > 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
              Exibindo {administradoresFiltrados.length} de {administradores.length} administrador{administradores.length !== 1 ? 'es' : ''}
            </Typography>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!admParaDesativar} onClose={handleFecharConfirmacao} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <WarningAmber color="warning" />
            <Typography variant="h6" fontWeight={600}>Desativar administrador</Typography>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Tem certeza que deseja desativar{' '}
            <strong>{admParaDesativar?.nome}</strong>? Ele perderá o acesso à
            plataforma como administrador. Essa ação pode ser revertida posteriormente.
          </Typography>

          {erroDesativar && (
            <Alert severity="error" sx={{ mt: 2 }}>{erroDesativar}</Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button variant="outlined" onClick={handleFecharConfirmacao} disabled={desativando}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmarDesativacao}
            disabled={desativando}
            startIcon={desativando ? <CircularProgress size={18} color="inherit" /> : <Block />}
          >
            {desativando ? 'Desativando...' : 'Desativar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
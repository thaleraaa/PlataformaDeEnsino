import { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button,
  Stack, Chip, Accordion, AccordionSummary, AccordionDetails,
  CircularProgress, Alert, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, IconButton, Tooltip,
} from '@mui/material';
import { ExpandMore, PlayCircle, School, Add, Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Aula { id: string; nome: string; videoAula: string; texto: string; modulo_id: string; }
interface Modulo { id: string; nome: string; aula: Aula[]; }
interface Disciplina { id: string; nome: string; modulos: Modulo[]; }

const BASE_URL = 'http://localhost:3000';

const modalVazio = { aberto: false, id: '', criando: false, erro: null as string | null };

export function DisciplinasProfessor() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | false>(false);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Modais criar
  const [modalDisciplina, setModalDisciplina] = useState(modalVazio);
  const [nomeDisciplina, setNomeDisciplina] = useState('');

  const [modalModulo, setModalModulo] = useState(modalVazio);
  const [nomeModulo, setNomeModulo] = useState('');

  const [modalAula, setModalAula] = useState(modalVazio);
  const [dadosAula, setDadosAula] = useState({ nome: '', videoAula: '', texto: '' });

  // Modais editar
  const [modalEditDisciplina, setModalEditDisciplina] = useState(modalVazio);
  const [nomeEditDisciplina, setNomeEditDisciplina] = useState('');

  const [modalEditModulo, setModalEditModulo] = useState(modalVazio);
  const [nomeEditModulo, setNomeEditModulo] = useState('');

  const [modalEditAula, setModalEditAula] = useState(modalVazio);
  const [dadosEditAula, setDadosEditAula] = useState({ nome: '', videoAula: '', texto: '' });

  // Modal confirmar exclusão
  const [modalDelete, setModalDelete] = useState<{ aberto: boolean; tipo: string; id: string; nome: string; deletando: boolean }>({
    aberto: false, tipo: '', id: '', nome: '', deletando: false,
  });

  const carregarDisciplinas = () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    fetch(`${BASE_URL}/disciplinas`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setDisciplinas)
      .catch(() => setErro('Erro ao carregar disciplinas.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { carregarDisciplinas(); }, []);

  const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const token = () => localStorage.getItem('token') ?? '';

  const post = (url: string, body: object) =>
    fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify(body),
    });

  const put = (url: string, body: object) =>
    fetch(`${BASE_URL}${url}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify(body),
    });

  const del = (url: string) =>
    fetch(`${BASE_URL}${url}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token()}` },
    });

  // ── CRIAR ──────────────────────────────────────────────
  const handleCriarDisciplina = async () => {
    if (!nomeDisciplina.trim()) return;
    setModalDisciplina(m => ({ ...m, criando: true, erro: null }));
    try {
      const res = await post('/disciplinas', { nome: nomeDisciplina.trim() });
      if (!res.ok) throw new Error();
      setModalDisciplina(modalVazio); setNomeDisciplina(''); carregarDisciplinas();
    } catch { setModalDisciplina(m => ({ ...m, criando: false, erro: 'Erro ao criar disciplina.' })); }
  };

  const handleCriarModulo = async () => {
    if (!nomeModulo.trim()) return;
    setModalModulo(m => ({ ...m, criando: true, erro: null }));
    try {
      const res = await post(`/modulos/disciplina/${modalModulo.id}`, { nome: nomeModulo.trim() });
      if (!res.ok) throw new Error();
      setModalModulo(modalVazio); setNomeModulo(''); carregarDisciplinas();
    } catch { setModalModulo(m => ({ ...m, criando: false, erro: 'Erro ao criar módulo.' })); }
  };

  const handleCriarAula = async () => {
    if (!dadosAula.nome.trim() || !dadosAula.videoAula.trim() || !dadosAula.texto.trim()) return;
    setModalAula(m => ({ ...m, criando: true, erro: null }));
    try {
      const res = await post(`/aulas/modulo/${modalAula.id}`, dadosAula);
      if (!res.ok) throw new Error();
      setModalAula(modalVazio); setDadosAula({ nome: '', videoAula: '', texto: '' }); carregarDisciplinas();
    } catch { setModalAula(m => ({ ...m, criando: false, erro: 'Erro ao criar aula.' })); }
  };

  // ── EDITAR ─────────────────────────────────────────────
  const handleEditarDisciplina = async () => {
    if (!nomeEditDisciplina.trim()) return;
    setModalEditDisciplina(m => ({ ...m, criando: true, erro: null }));
    try {
      const res = await put(`/disciplinas/${modalEditDisciplina.id}`, { nome: nomeEditDisciplina.trim() });
      if (!res.ok) throw new Error();
      setModalEditDisciplina(modalVazio); carregarDisciplinas();
    } catch { setModalEditDisciplina(m => ({ ...m, criando: false, erro: 'Erro ao editar disciplina.' })); }
  };

  const handleEditarModulo = async () => {
    if (!nomeEditModulo.trim()) return;
    setModalEditModulo(m => ({ ...m, criando: true, erro: null }));
    try {
      const res = await put(`/modulos/${modalEditModulo.id}`, { nome: nomeEditModulo.trim() });
      if (!res.ok) throw new Error();
      setModalEditModulo(modalVazio); carregarDisciplinas();
    } catch { setModalEditModulo(m => ({ ...m, criando: false, erro: 'Erro ao editar módulo.' })); }
  };

  const handleEditarAula = async () => {
    if (!dadosEditAula.nome.trim() || !dadosEditAula.videoAula.trim() || !dadosEditAula.texto.trim()) return;
    setModalEditAula(m => ({ ...m, criando: true, erro: null }));
    try {
      const res = await put(`/aulas/${modalEditAula.id}`, dadosEditAula);
      if (!res.ok) throw new Error();
      setModalEditAula(modalVazio); carregarDisciplinas();
    } catch { setModalEditAula(m => ({ ...m, criando: false, erro: 'Erro ao editar aula.' })); }
  };

  // ── DELETAR ────────────────────────────────────────────
  const handleDeletar = async () => {
    setModalDelete(m => ({ ...m, deletando: true }));
    const urls: Record<string, string> = {
      disciplina: `/disciplinas/${modalDelete.id}`,
      modulo: `/modulos/${modalDelete.id}`,
      aula: `/aulas/${modalDelete.id}`,
    };
    try {
      const res = await del(urls[modalDelete.tipo]);
      if (!res.ok) throw new Error();
      setModalDelete({ aberto: false, tipo: '', id: '', nome: '', deletando: false });
      carregarDisciplinas();
    } catch {
      setModalDelete(m => ({ ...m, deletando: false }));
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>;
  if (erro) return <Alert severity="error" sx={{ mt: 4 }}>{erro}</Alert>;

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography variant="h4" fontWeight={600}>Disciplinas</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setModalDisciplina(m => ({ ...m, aberto: true }))}>
          Nova Disciplina
        </Button>
      </Stack>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Gerencie as disciplinas e o conteúdo das aulas.
      </Typography>

      <Grid container spacing={3}>
        {disciplinas.map((disciplina) => {
          const totalAulas = disciplina.modulos.reduce((acc, m) => acc + m.aula.length, 0);
          return (
            <Grid item xs={12} key={disciplina.id}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                    <School sx={{ fontSize: 32, color: 'primary.main' }} />
                    <Box flex={1}>
                      <Typography variant="h6" fontWeight={600}>{disciplina.nome}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {disciplina.modulos.length} módulos • {totalAulas} aula
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Button size="small" variant="outlined" startIcon={<Add />}
                        onClick={() => setModalModulo({ aberto: true, id: disciplina.id, criando: false, erro: null })}>
                        Módulo
                      </Button>
                      <Tooltip title="Editar disciplina">
                        <IconButton size="small" onClick={() => {
                          setNomeEditDisciplina(disciplina.nome);
                          setModalEditDisciplina({ aberto: true, id: disciplina.id, criando: false, erro: null });
                        }}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Apagar disciplina">
                        <IconButton size="small" color="error" onClick={() =>
                          setModalDelete({ aberto: true, tipo: 'disciplina', id: disciplina.id, nome: disciplina.nome, deletando: false })}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>

                  {disciplina.modulos.map((modulo) => (
                    <Accordion key={modulo.id} expanded={expanded === modulo.id}
                      onChange={handleChange(modulo.id)} sx={{ bgcolor: 'background.default', mb: 1 }}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Stack direction="row" alignItems="center" spacing={2} flex={1} mr={1}>
                          <Typography fontWeight={500}>{modulo.nome}</Typography>
                          <Chip label={`${modulo.aula.length} aulas`} size="small" />
                          <Box flex={1} />
                          <Button size="small" variant="outlined" startIcon={<Add />}
                            onClick={(e) => { e.stopPropagation(); setModalAula({ aberto: true, id: modulo.id, criando: false, erro: null }); }}>
                            Aula
                          </Button>
                          <Tooltip title="Editar módulo">
                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); setNomeEditModulo(modulo.nome); setModalEditModulo({ aberto: true, id: modulo.id, criando: false, erro: null }); }}>
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Apagar módulo">
                            <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); setModalDelete({ aberto: true, tipo: 'modulo', id: modulo.id, nome: modulo.nome, deletando: false }); }}>
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Stack spacing={1}>
                          {modulo.aula.map((aula) => (
                            <Box key={aula.id} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <PlayCircle sx={{ color: 'primary.main' }} />
                                <Typography variant="body2">{aula.nome}</Typography>
                              </Stack>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Button size="small" variant="outlined" onClick={() => navigate(`/aula/${aula.id}`)}>
                                  Acessar
                                </Button>
                                <Tooltip title="Editar aula">
                                  <IconButton size="small" onClick={() => { setDadosEditAula({ nome: aula.nome, videoAula: aula.videoAula, texto: '' }); setModalEditAula({ aberto: true, id: aula.id, criando: false, erro: null }); }}>
                                    <Edit fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Apagar aula">
                                  <IconButton size="small" color="error" onClick={() => setModalDelete({ aberto: true, tipo: 'aula', id: aula.id, nome: aula.nome, deletando: false })}>
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
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

      {/* ── Modal: Nova Disciplina ── */}
      <Dialog open={modalDisciplina.aberto} onClose={() => { setModalDisciplina(modalVazio); setNomeDisciplina(''); }} fullWidth maxWidth="xs">
        <DialogTitle>Nova Disciplina</DialogTitle>
        <DialogContent>
          <TextField autoFocus label="Nome da disciplina" fullWidth variant="outlined" sx={{ mt: 1 }}
            value={nomeDisciplina} onChange={(e) => setNomeDisciplina(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCriarDisciplina(); }}
            error={!!modalDisciplina.erro} helperText={modalDisciplina.erro} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setModalDisciplina(modalVazio); setNomeDisciplina(''); }}>Cancelar</Button>
          <Button variant="contained" onClick={handleCriarDisciplina} disabled={!nomeDisciplina.trim() || modalDisciplina.criando}>
            {modalDisciplina.criando ? 'Criando...' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Modal: Editar Disciplina ── */}
      <Dialog open={modalEditDisciplina.aberto} onClose={() => setModalEditDisciplina(modalVazio)} fullWidth maxWidth="xs">
        <DialogTitle>Editar Disciplina</DialogTitle>
        <DialogContent>
          <TextField autoFocus label="Nome da disciplina" fullWidth variant="outlined" sx={{ mt: 1 }}
            value={nomeEditDisciplina} onChange={(e) => setNomeEditDisciplina(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleEditarDisciplina(); }}
            error={!!modalEditDisciplina.erro} helperText={modalEditDisciplina.erro} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setModalEditDisciplina(modalVazio)}>Cancelar</Button>
          <Button variant="contained" onClick={handleEditarDisciplina} disabled={!nomeEditDisciplina.trim() || modalEditDisciplina.criando}>
            {modalEditDisciplina.criando ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Modal: Novo Módulo ── */}
      <Dialog open={modalModulo.aberto} onClose={() => { setModalModulo(modalVazio); setNomeModulo(''); }} fullWidth maxWidth="xs">
        <DialogTitle>Novo Módulo</DialogTitle>
        <DialogContent>
          <TextField autoFocus label="Nome do módulo" fullWidth variant="outlined" sx={{ mt: 1 }}
            value={nomeModulo} onChange={(e) => setNomeModulo(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCriarModulo(); }}
            error={!!modalModulo.erro} helperText={modalModulo.erro} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setModalModulo(modalVazio); setNomeModulo(''); }}>Cancelar</Button>
          <Button variant="contained" onClick={handleCriarModulo} disabled={!nomeModulo.trim() || modalModulo.criando}>
            {modalModulo.criando ? 'Criando...' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Modal: Editar Módulo ── */}
      <Dialog open={modalEditModulo.aberto} onClose={() => setModalEditModulo(modalVazio)} fullWidth maxWidth="xs">
        <DialogTitle>Editar Módulo</DialogTitle>
        <DialogContent>
          <TextField autoFocus label="Nome do módulo" fullWidth variant="outlined" sx={{ mt: 1 }}
            value={nomeEditModulo} onChange={(e) => setNomeEditModulo(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleEditarModulo(); }}
            error={!!modalEditModulo.erro} helperText={modalEditModulo.erro} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setModalEditModulo(modalVazio)}>Cancelar</Button>
          <Button variant="contained" onClick={handleEditarModulo} disabled={!nomeEditModulo.trim() || modalEditModulo.criando}>
            {modalEditModulo.criando ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Modal: Nova Aula ── */}
      <Dialog open={modalAula.aberto} onClose={() => { setModalAula(modalVazio); setDadosAula({ nome: '', videoAula: '', texto: '' }); }} fullWidth maxWidth="sm">
        <DialogTitle>Nova Aula</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Nome da aula" fullWidth variant="outlined"
              value={dadosAula.nome} onChange={(e) => setDadosAula(d => ({ ...d, nome: e.target.value }))} />
            <TextField label="URL do vídeo (YouTube embed)" fullWidth variant="outlined"
              placeholder="https://www.youtube.com/embed/VIDEO_ID"
              value={dadosAula.videoAula} onChange={(e) => setDadosAula(d => ({ ...d, videoAula: e.target.value }))} />
            <TextField label="Texto / descrição" fullWidth variant="outlined" multiline rows={3}
              value={dadosAula.texto} onChange={(e) => setDadosAula(d => ({ ...d, texto: e.target.value }))} />
            {modalAula.erro && <Alert severity="error">{modalAula.erro}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setModalAula(modalVazio); setDadosAula({ nome: '', videoAula: '', texto: '' }); }}>Cancelar</Button>
          <Button variant="contained" onClick={handleCriarAula}
            disabled={!dadosAula.nome.trim() || !dadosAula.videoAula.trim() || !dadosAula.texto.trim() || modalAula.criando}>
            {modalAula.criando ? 'Criando...' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Modal: Editar Aula ── */}
      <Dialog open={modalEditAula.aberto} onClose={() => setModalEditAula(modalVazio)} fullWidth maxWidth="sm">
        <DialogTitle>Editar Aula</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Nome da aula" fullWidth variant="outlined"
              value={dadosEditAula.nome} onChange={(e) => setDadosEditAula(d => ({ ...d, nome: e.target.value }))} />
            <TextField label="URL do vídeo (YouTube embed)" fullWidth variant="outlined"
              placeholder="https://www.youtube.com/embed/VIDEO_ID"
              value={dadosEditAula.videoAula} onChange={(e) => setDadosEditAula(d => ({ ...d, videoAula: e.target.value }))} />
            <TextField label="Texto / descrição" fullWidth variant="outlined" multiline rows={3}
              value={dadosEditAula.texto} onChange={(e) => setDadosEditAula(d => ({ ...d, texto: e.target.value }))} />
            {modalEditAula.erro && <Alert severity="error">{modalEditAula.erro}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setModalEditAula(modalVazio)}>Cancelar</Button>
          <Button variant="contained" onClick={handleEditarAula}
            disabled={!dadosEditAula.nome.trim() || !dadosEditAula.videoAula.trim() || !dadosEditAula.texto.trim() || modalEditAula.criando}>
            {modalEditAula.criando ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Modal: Confirmar Exclusão ── */}
      <Dialog open={modalDelete.aberto} onClose={() => setModalDelete(m => ({ ...m, aberto: false }))} fullWidth maxWidth="xs">
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja apagar o {modalDelete.tipo} <strong>"{modalDelete.nome}"</strong>?
            {modalDelete.tipo === 'disciplina' && ' Todos os módulos e aulas serão removidos.'}
            {modalDelete.tipo === 'modulo' && ' Todas as aulas do módulo serão removidas.'}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setModalDelete(m => ({ ...m, aberto: false }))}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleDeletar} disabled={modalDelete.deletando}>
            {modalDelete.deletando ? 'Apagando...' : 'Apagar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
import { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button,
  Stack, Chip, Accordion, AccordionSummary, AccordionDetails,
  CircularProgress, Alert, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, IconButton, Tooltip,
} from '@mui/material';
import { ExpandMore, PlayCircle, School, Add, Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface Aula { id: string; nome: string; videoAula: string; texto: string; modulo_id: string; }
interface Modulo { id: string; nome: string; aula: Aula[]; }
interface Disciplina { id: string; nome: string; modulos: Modulo[]; }

const BASE_URL = 'http://localhost:3000';
const modalVazio = { aberto: false, id: '', salvando: false, erro: null as string | null };

// ── Schemas Yup ─────────────────────────────────────────
const schemaDisciplina = yup.object({
  nome: yup
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(80, 'Nome deve ter no máximo 80 caracteres')
    .required('Nome da disciplina é obrigatório'),
}).required();

const schemaModulo = yup.object({
  nome: yup
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(80, 'Nome deve ter no máximo 80 caracteres')
    .required('Nome do módulo é obrigatório'),
}).required();

const schemaAula = yup.object({
  nome: yup
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .required('Nome da aula é obrigatório'),
  videoAula: yup
    .string()
    .url('Informe uma URL válida (ex: https://www.youtube.com/embed/...)')
    .matches(/youtube\.com\/embed\/|youtu\.be\//, 'Use o link de incorporação do YouTube (youtube.com/embed/...)')
    .required('URL do vídeo é obrigatória'),
  texto: yup
    .string()
    .min(10, 'Texto deve ter no mínimo 10 caracteres')
    .required('Texto/descrição da aula é obrigatório'),
}).required();

type FormDisciplina = { nome: string };
type FormModulo = { nome: string };
type FormAula = { nome: string; videoAula: string; texto: string };

export function DisciplinasProfessor() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | false>(false);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Estado dos modais (aberto/id/salvando)
  const [modalDisciplina, setModalDisciplina] = useState(modalVazio);
  const [modalEditDisciplina, setModalEditDisciplina] = useState(modalVazio);
  const [modalModulo, setModalModulo] = useState(modalVazio);
  const [modalEditModulo, setModalEditModulo] = useState(modalVazio);
  const [modalAula, setModalAula] = useState(modalVazio);
  const [modalEditAula, setModalEditAula] = useState(modalVazio);
  const [modalDelete, setModalDelete] = useState<{ aberto: boolean; tipo: string; id: string; nome: string; deletando: boolean }>({
    aberto: false, tipo: '', id: '', nome: '', deletando: false,
  });

  // ── Formulários react-hook-form ──────────────────────
  const formCriarDisciplina = useForm<FormDisciplina>({ resolver: yupResolver(schemaDisciplina) });
  const formEditDisciplina = useForm<FormDisciplina>({ resolver: yupResolver(schemaDisciplina) });
  const formCriarModulo = useForm<FormModulo>({ resolver: yupResolver(schemaModulo) });
  const formEditModulo = useForm<FormModulo>({ resolver: yupResolver(schemaModulo) });
  const formCriarAula = useForm<FormAula>({ resolver: yupResolver(schemaAula) });
  const formEditAula = useForm<FormAula>({ resolver: yupResolver(schemaAula) });

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
    fetch(`${BASE_URL}${url}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` }, body: JSON.stringify(body) });
  const put = (url: string, body: object) =>
    fetch(`${BASE_URL}${url}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` }, body: JSON.stringify(body) });
  const del = (url: string) =>
    fetch(`${BASE_URL}${url}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } });

  // ── CRIAR ────────────────────────────────────────────
  const handleCriarDisciplina = formCriarDisciplina.handleSubmit(async (data) => {
    setModalDisciplina(m => ({ ...m, salvando: true, erro: null }));
    try {
      const res = await post('/disciplinas', { nome: data.nome.trim() });
      if (!res.ok) throw new Error();
      setModalDisciplina(modalVazio);
      formCriarDisciplina.reset();
      carregarDisciplinas();
    } catch {
      setModalDisciplina(m => ({ ...m, salvando: false, erro: 'Erro ao criar disciplina.' }));
    }
  });

  const handleCriarModulo = formCriarModulo.handleSubmit(async (data) => {
    setModalModulo(m => ({ ...m, salvando: true, erro: null }));
    try {
      const res = await post(`/modulos/disciplina/${modalModulo.id}`, { nome: data.nome.trim() });
      if (!res.ok) throw new Error();
      setModalModulo(modalVazio);
      formCriarModulo.reset();
      carregarDisciplinas();
    } catch {
      setModalModulo(m => ({ ...m, salvando: false, erro: 'Erro ao criar módulo.' }));
    }
  });

  const handleCriarAula = formCriarAula.handleSubmit(async (data) => {
    setModalAula(m => ({ ...m, salvando: true, erro: null }));
    try {
      const res = await post(`/aulas/modulo/${modalAula.id}`, data);
      if (!res.ok) throw new Error();
      setModalAula(modalVazio);
      formCriarAula.reset();
      carregarDisciplinas();
    } catch {
      setModalAula(m => ({ ...m, salvando: false, erro: 'Erro ao criar aula.' }));
    }
  });

  // ── EDITAR ───────────────────────────────────────────
  const handleEditarDisciplina = formEditDisciplina.handleSubmit(async (data) => {
    setModalEditDisciplina(m => ({ ...m, salvando: true, erro: null }));
    try {
      const res = await put(`/disciplinas/${modalEditDisciplina.id}`, { nome: data.nome.trim() });
      if (!res.ok) throw new Error();
      setModalEditDisciplina(modalVazio);
      carregarDisciplinas();
    } catch {
      setModalEditDisciplina(m => ({ ...m, salvando: false, erro: 'Erro ao editar disciplina.' }));
    }
  });

  const handleEditarModulo = formEditModulo.handleSubmit(async (data) => {
    setModalEditModulo(m => ({ ...m, salvando: true, erro: null }));
    try {
      const res = await put(`/modulos/${modalEditModulo.id}`, { nome: data.nome.trim() });
      if (!res.ok) throw new Error();
      setModalEditModulo(modalVazio);
      carregarDisciplinas();
    } catch {
      setModalEditModulo(m => ({ ...m, salvando: false, erro: 'Erro ao editar módulo.' }));
    }
  });

  const handleEditarAula = formEditAula.handleSubmit(async (data) => {
    setModalEditAula(m => ({ ...m, salvando: true, erro: null }));
    try {
      const res = await put(`/aulas/${modalEditAula.id}`, data);
      if (!res.ok) throw new Error();
      setModalEditAula(modalVazio);
      carregarDisciplinas();
    } catch {
      setModalEditAula(m => ({ ...m, salvando: false, erro: 'Erro ao editar aula.' }));
    }
  });

  // ── DELETAR ──────────────────────────────────────────
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
        <Button variant="contained" startIcon={<Add />}
          onClick={() => { formCriarDisciplina.reset(); setModalDisciplina(m => ({ ...m, aberto: true })); }}>
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
                        {disciplina.modulos.length} módulos • {totalAulas} aulas
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Button size="small" variant="outlined" startIcon={<Add />}
                        onClick={() => { formCriarModulo.reset(); setModalModulo({ aberto: true, id: disciplina.id, salvando: false, erro: null }); }}>
                        Módulo
                      </Button>
                      <Tooltip title="Editar disciplina">
                        <IconButton size="small" onClick={() => {
                          formEditDisciplina.reset({ nome: disciplina.nome });
                          setModalEditDisciplina({ aberto: true, id: disciplina.id, salvando: false, erro: null });
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
                            onClick={(e) => {
                              e.stopPropagation();
                              formCriarAula.reset();
                              setModalAula({ aberto: true, id: modulo.id, salvando: false, erro: null });
                            }}>
                            Aula
                          </Button>
                          <Tooltip title="Editar módulo">
                            <IconButton size="small" onClick={(e) => {
                              e.stopPropagation();
                              formEditModulo.reset({ nome: modulo.nome });
                              setModalEditModulo({ aberto: true, id: modulo.id, salvando: false, erro: null });
                            }}>
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Apagar módulo">
                            <IconButton size="small" color="error" onClick={(e) => {
                              e.stopPropagation();
                              setModalDelete({ aberto: true, tipo: 'modulo', id: modulo.id, nome: modulo.nome, deletando: false });
                            }}>
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
                                  <IconButton size="small" onClick={() => {
                                    formEditAula.reset({ nome: aula.nome, videoAula: aula.videoAula, texto: aula.texto });
                                    setModalEditAula({ aberto: true, id: aula.id, salvando: false, erro: null });
                                  }}>
                                    <Edit fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Apagar aula">
                                  <IconButton size="small" color="error" onClick={() =>
                                    setModalDelete({ aberto: true, tipo: 'aula', id: aula.id, nome: aula.nome, deletando: false })}>
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
      <Dialog open={modalDisciplina.aberto} onClose={() => { setModalDisciplina(modalVazio); formCriarDisciplina.reset(); }} fullWidth maxWidth="xs">
        <DialogTitle>Nova Disciplina</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus label="Nome da disciplina" fullWidth variant="outlined" sx={{ mt: 1 }}
            {...formCriarDisciplina.register('nome')}
            error={!!formCriarDisciplina.formState.errors.nome}
            helperText={formCriarDisciplina.formState.errors.nome?.message ?? ' '}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCriarDisciplina(); }}
          />
          {modalDisciplina.erro && <Alert severity="error" sx={{ mt: 1 }}>{modalDisciplina.erro}</Alert>}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setModalDisciplina(modalVazio); formCriarDisciplina.reset(); }}>Cancelar</Button>
          <Button variant="contained" onClick={handleCriarDisciplina} disabled={modalDisciplina.salvando}>
            {modalDisciplina.salvando ? 'Criando...' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Modal: Editar Disciplina ── */}
      <Dialog open={modalEditDisciplina.aberto} onClose={() => setModalEditDisciplina(modalVazio)} fullWidth maxWidth="xs">
        <DialogTitle>Editar Disciplina</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus label="Nome da disciplina" fullWidth variant="outlined" sx={{ mt: 1 }}
            {...formEditDisciplina.register('nome')}
            error={!!formEditDisciplina.formState.errors.nome}
            helperText={formEditDisciplina.formState.errors.nome?.message ?? ' '}
            onKeyDown={(e) => { if (e.key === 'Enter') handleEditarDisciplina(); }}
          />
          {modalEditDisciplina.erro && <Alert severity="error" sx={{ mt: 1 }}>{modalEditDisciplina.erro}</Alert>}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setModalEditDisciplina(modalVazio)}>Cancelar</Button>
          <Button variant="contained" onClick={handleEditarDisciplina} disabled={modalEditDisciplina.salvando}>
            {modalEditDisciplina.salvando ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Modal: Novo Módulo ── */}
      <Dialog open={modalModulo.aberto} onClose={() => { setModalModulo(modalVazio); formCriarModulo.reset(); }} fullWidth maxWidth="xs">
        <DialogTitle>Novo Módulo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus label="Nome do módulo" fullWidth variant="outlined" sx={{ mt: 1 }}
            {...formCriarModulo.register('nome')}
            error={!!formCriarModulo.formState.errors.nome}
            helperText={formCriarModulo.formState.errors.nome?.message ?? ' '}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCriarModulo(); }}
          />
          {modalModulo.erro && <Alert severity="error" sx={{ mt: 1 }}>{modalModulo.erro}</Alert>}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setModalModulo(modalVazio); formCriarModulo.reset(); }}>Cancelar</Button>
          <Button variant="contained" onClick={handleCriarModulo} disabled={modalModulo.salvando}>
            {modalModulo.salvando ? 'Criando...' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Modal: Editar Módulo ── */}
      <Dialog open={modalEditModulo.aberto} onClose={() => setModalEditModulo(modalVazio)} fullWidth maxWidth="xs">
        <DialogTitle>Editar Módulo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus label="Nome do módulo" fullWidth variant="outlined" sx={{ mt: 1 }}
            {...formEditModulo.register('nome')}
            error={!!formEditModulo.formState.errors.nome}
            helperText={formEditModulo.formState.errors.nome?.message ?? ' '}
            onKeyDown={(e) => { if (e.key === 'Enter') handleEditarModulo(); }}
          />
          {modalEditModulo.erro && <Alert severity="error" sx={{ mt: 1 }}>{modalEditModulo.erro}</Alert>}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setModalEditModulo(modalVazio)}>Cancelar</Button>
          <Button variant="contained" onClick={handleEditarModulo} disabled={modalEditModulo.salvando}>
            {modalEditModulo.salvando ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Modal: Nova Aula ── */}
      <Dialog open={modalAula.aberto} onClose={() => { setModalAula(modalVazio); formCriarAula.reset(); }} fullWidth maxWidth="sm">
        <DialogTitle>Nova Aula</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nome da aula" fullWidth variant="outlined"
              {...formCriarAula.register('nome')}
              error={!!formCriarAula.formState.errors.nome}
              helperText={formCriarAula.formState.errors.nome?.message ?? ' '}
            />
            <TextField
              label="URL do vídeo (YouTube embed)" fullWidth variant="outlined"
              placeholder="https://www.youtube.com/embed/VIDEO_ID"
              {...formCriarAula.register('videoAula')}
              error={!!formCriarAula.formState.errors.videoAula}
              helperText={formCriarAula.formState.errors.videoAula?.message ?? ' '}
            />
            <TextField
              label="Texto / descrição" fullWidth variant="outlined" multiline rows={3}
              {...formCriarAula.register('texto')}
              error={!!formCriarAula.formState.errors.texto}
              helperText={formCriarAula.formState.errors.texto?.message ?? ' '}
            />
            {modalAula.erro && <Alert severity="error">{modalAula.erro}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setModalAula(modalVazio); formCriarAula.reset(); }}>Cancelar</Button>
          <Button variant="contained" onClick={handleCriarAula} disabled={modalAula.salvando}>
            {modalAula.salvando ? 'Criando...' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Modal: Editar Aula ── */}
      <Dialog open={modalEditAula.aberto} onClose={() => setModalEditAula(modalVazio)} fullWidth maxWidth="sm">
        <DialogTitle>Editar Aula</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nome da aula" fullWidth variant="outlined"
              {...formEditAula.register('nome')}
              error={!!formEditAula.formState.errors.nome}
              helperText={formEditAula.formState.errors.nome?.message ?? ' '}
            />
            <TextField
              label="URL do vídeo (YouTube embed)" fullWidth variant="outlined"
              placeholder="https://www.youtube.com/embed/VIDEO_ID"
              {...formEditAula.register('videoAula')}
              error={!!formEditAula.formState.errors.videoAula}
              helperText={formEditAula.formState.errors.videoAula?.message ?? ' '}
            />
            <TextField
              label="Texto / descrição" fullWidth variant="outlined" multiline rows={3}
              {...formEditAula.register('texto')}
              error={!!formEditAula.formState.errors.texto}
              helperText={formEditAula.formState.errors.texto?.message ?? ' '}
            />
            {modalEditAula.erro && <Alert severity="error">{modalEditAula.erro}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setModalEditAula(modalVazio)}>Cancelar</Button>
          <Button variant="contained" onClick={handleEditarAula} disabled={modalEditAula.salvando}>
            {modalEditAula.salvando ? 'Salvando...' : 'Salvar'}
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

import { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Avatar,
  CircularProgress, Alert, Chip, Divider, Stack,
  Button, TextField, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions,
  Snackbar,
} from '@mui/material';
import {
  Person, Email, School, Badge, LocalHospital,
  AttachMoney, CheckCircle, Cancel, Edit, DeleteForever,
} from '@mui/icons-material';
import { api } from '../services/api';
import type { Role } from '../mockData';

// ─── tipos ────────────────────────────────────────────────────────────────────

interface ContaInfo { id: string; nome: string; email: string; role: Role; }

interface PerfilAluno    { id: string; periodo: number; faculdade: string; conta: ContaInfo; }
interface PerfilProfessor{ id: string; CRM: string; salario: number; ativo: boolean; conta: ContaInfo; }
interface PerfilAdmin    { id: string; ativo: boolean; conta: ContaInfo; }
type PerfilData = PerfilAluno | PerfilProfessor | PerfilAdmin;

interface PerfilProps { userRole: Role; onLogout?: () => void; }

// ─── componente auxiliar ──────────────────────────────────────────────────────

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5 }}>
      <Box sx={{ color: 'primary.main', display: 'flex' }}>{icon}</Box>
      <Box>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Typography variant="body1" fontWeight={500}>{value}</Typography>
      </Box>
    </Box>
  );
}

// ─── componente principal ─────────────────────────────────────────────────────

export function Perfil({ userRole, onLogout }: PerfilProps) {
  const [dados, setDados]           = useState<PerfilData | null>(null);
  const [loading, setLoading]       = useState(true);
  const [erro, setErro]             = useState<string | null>(null);

  // edit
  const [editOpen, setEditOpen]     = useState(false);
  const [editFields, setEditFields] = useState<Record<string, string | number | boolean>>({});
  const [saving, setSaving]         = useState(false);

  // delete
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting]     = useState(false);

  // feedback
  const [snack, setSnack]           = useState<string | null>(null);

  // ── fetch /me ──────────────────────────────────────────────────────────────

  const fetchMe = () => {
    const token = localStorage.getItem('token');
    if (!token) { setErro('Não autenticado.'); setLoading(false); return; }

    const endpoint =
      userRole === 'ALUNO'       ? '/alunos/me'
      : userRole === 'PROFESSOR' ? '/professores/me'
      :                            '/administradores/me';

    api.get(endpoint, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setDados(res.data))
      .catch(() => setErro('Erro ao carregar perfil.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMe(); }, [userRole]);

  // ── abrir modal de edição com valores atuais ───────────────────────────────

  const handleOpenEdit = () => {
    if (!dados) return;
    if (userRole === 'ALUNO') {
      const a = dados as PerfilAluno;
      setEditFields({ periodo: a.periodo, faculdade: a.faculdade });
    } else if (userRole === 'PROFESSOR') {
      const p = dados as PerfilProfessor;
      setEditFields({ CRM: p.CRM, salario: p.salario });
    } else {
      const adm = dados as PerfilAdmin;
      setEditFields({ ativo: adm.ativo });
    }
    setEditOpen(true);
  };

  // ── salvar edição ──────────────────────────────────────────────────────────

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token || !dados) return;
    setSaving(true);

    const endpoint =
      userRole === 'ALUNO'       ? '/alunos/'
      : userRole === 'PROFESSOR' ? '/professores/'
      :                            '/administradores/';

    try {
      await api.put(endpoint, editFields, { headers: { Authorization: `Bearer ${token}` } });
      setSnack('Dados atualizados com sucesso!');
      setEditOpen(false);
      setLoading(true);
      fetchMe();
    } catch {
      setSnack('Erro ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  // ── deletar conta ──────────────────────────────────────────────────────────

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token || !dados) return;
    setDeleting(true);

    const endpoint =
      userRole === 'ALUNO'       ? '/alunos/'
      : userRole === 'PROFESSOR' ? '/professores/'
      :                            `/administradores/${dados.id}`;  // ADM precisa do ID na URL

    try {
      await api.delete(endpoint, { headers: { Authorization: `Bearer ${token}` } });
      localStorage.removeItem('token');
      setSnack('Conta encerrada.');
      setTimeout(() => onLogout?.(), 1200);
    } catch {
      setSnack('Erro ao encerrar conta.');
      setDeleting(false);
    }
  };

  // ── render ─────────────────────────────────────────────────────────────────

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <CircularProgress />
    </Box>
  );

  if (erro || !dados) return (
    <Alert severity="error" sx={{ mt: 4 }}>{erro ?? 'Dados não encontrados.'}</Alert>
  );

  const conta = dados.conta;

  // label do botão de delete varia por role
  const deleteLabel =
    userRole === 'ALUNO' ? 'Excluir minha conta'
    : 'Desativar minha conta';

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" fontWeight={700} mb={3}>Meu Perfil</Typography>

      <Card elevation={2}>
        <CardContent sx={{ p: 4 }}>

          {/* Header */}
          <Stack direction="row" alignItems="center" gap={3} mb={3}>
            <Avatar sx={{ width: 72, height: 72, bgcolor: 'primary.main', fontSize: 32 }}>
              {conta.nome.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>{conta.nome}</Typography>
              <Chip label={conta.role} color="primary" size="small" sx={{ mt: 0.5 }} />
            </Box>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          {/* Dados comuns */}
          <InfoRow icon={<Person />} label="Nome completo" value={conta.nome} />
          <InfoRow icon={<Email />}  label="E-mail"        value={conta.email} />

          {/* Dados por role */}
          {userRole === 'ALUNO' && (() => {
            const a = dados as PerfilAluno;
            return (
              <>
                <InfoRow icon={<School />} label="Faculdade" value={a.faculdade} />
                <InfoRow icon={<Badge />}  label="Período"   value={`${a.periodo}º período`} />
              </>
            );
          })()}

          {userRole === 'PROFESSOR' && (() => {
            const p = dados as PerfilProfessor;
            return (
              <>
                <InfoRow icon={<LocalHospital />} label="CRM"     value={p.CRM} />
                <InfoRow icon={<AttachMoney />}   label="Salário" value={`R$ ${Number(p.salario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                <InfoRow
                  icon={p.ativo ? <CheckCircle color="success" /> : <Cancel color="error" />}
                  label="Status"
                  value={p.ativo ? 'Ativo' : 'Inativo'}
                />
              </>
            );
          })()}

          {userRole === 'ADMINISTRADOR' && (() => {
            const adm = dados as PerfilAdmin;
            return (
              <InfoRow
                icon={adm.ativo ? <CheckCircle color="success" /> : <Cancel color="error" />}
                label="Status"
                value={adm.ativo ? 'Ativo' : 'Inativo'}
              />
            );
          })()}

          <Divider sx={{ mt: 3, mb: 3 }} />

          {/* Ações */}
          <Stack direction="row" gap={2}>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={handleOpenEdit}
            >
              Editar dados
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteForever />}
              onClick={() => setDeleteOpen(true)}
            >
              {deleteLabel}
            </Button>
          </Stack>

        </CardContent>
      </Card>

      {/* ── Modal de edição ──────────────────────────────────────────────── */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Editar dados</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>

            {userRole === 'ALUNO' && (
              <>
                <TextField
                  label="Faculdade"
                  value={editFields.faculdade ?? ''}
                  onChange={e => setEditFields(f => ({ ...f, faculdade: e.target.value }))}
                  fullWidth
                />
                <TextField
                  label="Período"
                  type="number"
                  value={editFields.periodo ?? ''}
                  onChange={e => setEditFields(f => ({ ...f, periodo: Number(e.target.value) }))}
                  fullWidth
                />
              </>
            )}

            {userRole === 'PROFESSOR' && (
              <>
                <TextField
                  label="CRM"
                  value={editFields.CRM ?? ''}
                  onChange={e => setEditFields(f => ({ ...f, CRM: e.target.value }))}
                  fullWidth
                />
                <TextField
                  label="Salário"
                  type="number"
                  value={editFields.salario ?? ''}
                  onChange={e => setEditFields(f => ({ ...f, salario: Number(e.target.value) }))}
                  fullWidth
                />
              </>
            )}

            {userRole === 'ADMINISTRADOR' && (
              <TextField
                label="Status (ativo)"
                select
                SelectProps={{ native: true }}
                value={String(editFields.ativo ?? true)}
                onChange={e => setEditFields(f => ({ ...f, ativo: e.target.value === 'true' }))}
                fullWidth
              >
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </TextField>
            )}

          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? <CircularProgress size={20} color="inherit" /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Confirmação de delete ─────────────────────────────────────────── */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Tem certeza?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {userRole === 'ALUNO'
              ? 'Sua conta será excluída permanentemente e você perderá todo o seu progresso.'
              : 'Sua conta será desativada. Um administrador pode reativá-la futuramente.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={handleDelete} disabled={deleting}>
            {deleting ? <CircularProgress size={20} color="inherit" /> : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Snackbar de feedback ──────────────────────────────────────────── */}
      <Snackbar
        open={!!snack}
        autoHideDuration={3000}
        onClose={() => setSnack(null)}
        message={snack}
      />
    </Box>
  );
}
import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button,
  Stack, CircularProgress, Alert, InputAdornment,
  TextField, Divider,
} from '@mui/material';
import { Quiz, AccessTime, CheckCircle } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

interface IFormSimulado {
  quantidadeQuestao: number;
  tempoMaximo: number;
}

const schema = yup.object({
  quantidadeQuestao: yup
    .number()
    .typeError('Informe um número válido')
    .integer('A quantidade deve ser um número inteiro')
    .min(1, 'Mínimo de 1 questão')
    .max(200, 'Máximo de 200 questões')
    .required('Quantidade de questões é obrigatória'),
  tempoMaximo: yup
    .number()
    .typeError('Informe um número válido')
    .integer('O tempo deve ser um número inteiro')
    .min(5, 'Tempo mínimo de 5 minutos')
    .max(480, 'Tempo máximo de 480 minutos (8 horas)')
    .required('Tempo máximo é obrigatório'),
}).required();

export function CriarSimulado() {
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erroApi, setErroApi] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<IFormSimulado>({
    resolver: yupResolver(schema),
  });

  const qtd = watch('quantidadeQuestao');
  const tempo = watch('tempoMaximo');
  const tempoPorQuestao = qtd > 0 && tempo > 0
    ? Math.floor((tempo * 60) / qtd)
    : null;

  const onSubmit = async (data: IFormSimulado) => {
    setSalvando(true);
    setErroApi(null);
    setSucesso(false);

    try {
      const token = localStorage.getItem('token') ?? '';
      await axios.post(`${BASE_URL}/simulados`, {
        quantidadeQuestao: data.quantidadeQuestao,
        tempoMaximo: data.tempoMaximo,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      reset();
      setSucesso(true);
    } catch (err) {
      const mensagem = axios.isAxiosError(err) ? err.response?.data?.message : null;
      setErroApi(mensagem || 'Erro ao conectar com o servidor.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Criar Simulado
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Configure um novo simulado com quantidade de questões e tempo limite.
      </Typography>

      <Card sx={{ maxWidth: 520 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3}>

            {/* Quantidade de questões */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <Quiz sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="subtitle2" fontWeight={600}>
                  Quantidade de Questões
                </Typography>
              </Stack>
              <TextField
                fullWidth
                type="number"
                placeholder="Ex: 50"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">questões</InputAdornment>
                  ),
                  inputProps: { min: 1, max: 200 },
                }}
                {...register('quantidadeQuestao')}
                error={!!errors.quantidadeQuestao}
                helperText={errors.quantidadeQuestao?.message ?? 'Entre 1 e 200 questões'}
              />
            </Box>

            {/* Tempo máximo */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <AccessTime sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="subtitle2" fontWeight={600}>
                  Tempo Máximo
                </Typography>
              </Stack>
              <TextField
                fullWidth
                type="number"
                placeholder="Ex: 120"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">minutos</InputAdornment>
                  ),
                  inputProps: { min: 5, max: 480 },
                }}
                {...register('tempoMaximo')}
                error={!!errors.tempoMaximo}
                helperText={errors.tempoMaximo?.message ?? 'Entre 5 e 480 minutos (8 horas)'}
              />
            </Box>

            {/* Preview calculado */}
            {tempoPorQuestao !== null && (
              <>
                <Divider />
                <Box sx={{ bgcolor: 'background.default', borderRadius: 1, p: 2 }}>
                  <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                    Resumo do simulado
                  </Typography>
                  <Stack direction="row" spacing={3}>
                    <Box>
                      <Typography variant="h6" fontWeight={700} color="primary.main">
                        {qtd}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">questões</Typography>
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={700} color="primary.main">
                        {tempo}min
                      </Typography>
                      <Typography variant="caption" color="text.secondary">tempo total</Typography>
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={700} color="secondary.main">
                        ~{tempoPorQuestao}s
                      </Typography>
                      <Typography variant="caption" color="text.secondary">por questão</Typography>
                    </Box>
                  </Stack>
                </Box>
              </>
            )}

            {sucesso && (
              <Alert severity="success" icon={<CheckCircle />} onClose={() => setSucesso(false)}>
                Simulado criado com sucesso!
              </Alert>
            )}

            {erroApi && (
              <Alert severity="error" onClose={() => setErroApi(null)}>
                {erroApi}
              </Alert>
            )}

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSubmit(onSubmit)}
              disabled={salvando}
            >
              {salvando ? <CircularProgress size={24} color="inherit" /> : 'Criar Simulado'}
            </Button>

          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

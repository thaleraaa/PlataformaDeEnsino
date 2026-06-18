import axios from 'axios';

const BASE_URL = 'http://localhost:3000'; // url do seu Fastify

export const disciplinaService = {

  getAll: async (token: string) => {
    const res = await axios.get(`${BASE_URL}/disciplinas`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  getById: async (id: string, token: string) => {
    const res = await axios.get(`${BASE_URL}/disciplinas/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  create: async (data: { nome: string }, token: string) => {
    const res = await axios.post(`${BASE_URL}/disciplinas`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },
};

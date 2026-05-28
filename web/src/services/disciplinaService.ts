const BASE_URL = 'http://localhost:3000'; // url do seu Fastify

export const disciplinaService = {

  getAll: async (token: string) => {
    const res = await fetch(`${BASE_URL}/disciplinas`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  getById: async (id: string, token: string) => {
    const res = await fetch(`${BASE_URL}/disciplinas/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  create: async (data: { nome: string }, token: string) => {
    const res = await fetch(`${BASE_URL}/disciplinas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },
};
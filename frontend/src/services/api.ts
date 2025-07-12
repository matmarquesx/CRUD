import axios from 'axios';
import { AuthResponse, TarefasResponse } from '../types';

const API_URL = 'http://localhost:3000';

// Configuração do axios com interceptor para incluir token
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@App:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Serviço de autenticação
export const authService = {
  // Login
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { username, password });
    return response.data;
  },

  // Registro (apenas admin)
  register: async (username: string, password: string, nome: string, tipo: string): Promise<any> => {
    const response = await api.post('/auth/register', { username, password, nome, tipo });
    return response.data;
  },

  // Logout
  logout: async (): Promise<any> => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Alteração de senha
  changePassword: async (oldPassword: string, newPassword: string): Promise<any> => {
  const response = await api.post('/auth/change-password', { oldPassword, newPassword });
  return response.data;
},

  // Recuperação de senha
  recoverPassword: async (username: string): Promise<any> => {
  const response = await api.post('/auth/recover-password', { username });
  return response.data;
  }
};

// Serviço de tarefas
export const tarefasService = {
  // Listar tarefas com paginação
  listar: async (page: number = 1): Promise<TarefasResponse> => {
    const response = await api.get<TarefasResponse>(`/tarefas?page=${page}`);
    return response.data;
  },

  // Criar tarefa
  criar: async (titulo: string, descricao: string, concluida: boolean = false): Promise<any> => {
    const response = await api.post('/tarefas', { titulo, descricao, concluida });
    return response.data;
  },

  // Atualizar tarefa
  atualizar: async (id: number, titulo: string, descricao: string, concluida: boolean): Promise<any> => {
    const response = await api.put(`/tarefas/${id}`, { titulo, descricao, concluida });
    return response.data;
  },

  // Deletar tarefa
  deletar: async (id: number): Promise<any> => {
    const response = await api.delete(`/tarefas/${id}`);
    return response.data;
  }
};

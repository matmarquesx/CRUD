export interface Usuario {
  username: string;
  nome: string;
  tipo: string;
  status: string;
  quant_acesso: number;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: Usuario;
}

export interface Tarefa {
  id: number;
  titulo: string;
  descricao: string;
  concluida: boolean;
  data_criacao: string;
  usuario_username: string;
}

export interface TarefasResponse {
  tarefas: Tarefa[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

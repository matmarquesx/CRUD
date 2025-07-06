import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tarefasService } from '../services/api.ts';
import { useAuth } from '../contexts/auth.tsx';
import { Tarefa } from '../types';
import '../styles/AuthForm.css';

const TarefasList: React.FunctionComponent = () => {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Estado para nova tarefa
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  // Estado para edição
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editDescricao, setEditDescricao] = useState('');
  const [editConcluida, setEditConcluida] = useState(false);

  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Carregar tarefas
  const loadTarefas = async (page: number = 1) => {
    try {
      setLoading(true);
      setError('');
      const response = await tarefasService.listar(page);
      setTarefas(response.tarefas);
      setCurrentPage(response.pagination.page);
      setTotalPages(response.pagination.totalPages);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  };

  // Carregar tarefas ao montar o componente
  useEffect(() => {
    loadTarefas();
  }, []);

  // Criar nova tarefa
  const handleCreateTarefa = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!novoTitulo || !novaDescricao) {
      setError('Preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await tarefasService.criar(novoTitulo, novaDescricao);
      
      // Limpar campos e recarregar tarefas
      setNovoTitulo('');
      setNovaDescricao('');
      setShowForm(false);
      await loadTarefas();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar tarefa');
    } finally {
      setLoading(false);
    }
  };

  // Iniciar edição de tarefa
  const startEdit = (tarefa: Tarefa) => {
    setEditingId(tarefa.id);
    setEditTitulo(tarefa.titulo);
    setEditDescricao(tarefa.descricao);
    setEditConcluida(tarefa.concluida);
  };

  // Cancelar edição
  const cancelEdit = () => {
    setEditingId(null);
  };

  // Salvar edição
  const saveEdit = async (id: number) => {
    try {
      setLoading(true);
      setError('');
      await tarefasService.atualizar(id, editTitulo, editDescricao, editConcluida);
      setEditingId(null);
      await loadTarefas(currentPage);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar tarefa');
    } finally {
      setLoading(false);
    }
  };

  // Deletar tarefa
  const deleteTarefa = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      await tarefasService.deletar(id);
      await loadTarefas(currentPage);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao deletar tarefa');
    } finally {
      setLoading(false);
    }
  };

  // Alternar status de conclusão
  const toggleConcluida = async (tarefa: Tarefa) => {
    try {
      setLoading(true);
      setError('');
      await tarefasService.atualizar(
        tarefa.id, 
        tarefa.titulo, 
        tarefa.descricao, 
        !tarefa.concluida
      );
      await loadTarefas(currentPage);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar tarefa');
    } finally {
      setLoading(false);
    }
  };

  // Navegação de páginas
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    loadTarefas(page);
  };

  return (
    <div className="tarefas-container">
      <header className="tarefas-header">
        <h1>Gerenciamento de Tarefas</h1>
        <div className="user-info">
          <span>Olá, {user?.nome}</span>
          <div className="header-buttons">
            {isAdmin() && (
              <button 
                className="register-button"
                onClick={() => navigate('/register')}
              >
                Cadastrar Usuário
              </button>
            )}
            <button 
              className="password-button"
              onClick={() => navigate('/password')}
            >
              Alterar Senha
            </button>
            <button 
              className="logout-button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="tarefas-content">
        {error && <div className="error-message">{error}</div>}
        
        <div className="tarefas-actions">
          <button 
            className="new-task-button"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancelar' : 'Nova Tarefa'}
          </button>
        </div>
        
        {showForm && (
          <div className="new-task-form">
            <h3>Nova Tarefa</h3>
            <form onSubmit={handleCreateTarefa}>
              <div className="form-group">
                <label htmlFor="titulo">Título</label>
                <input
                  type="text"
                  id="titulo"
                  value={novoTitulo}
                  onChange={(e) => setNovoTitulo(e.target.value)}
                  placeholder="Título da tarefa"
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="descricao">Descrição</label>
                <textarea
                  id="descricao"
                  value={novaDescricao}
                  onChange={(e) => setNovaDescricao(e.target.value)}
                  placeholder="Descrição da tarefa"
                  disabled={loading}
                />
              </div>
              
              <div className="form-buttons">
                <button 
                  type="submit" 
                  className="save-button" 
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Salvar'}
                </button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
        
        {loading && !tarefas.length ? (
          <div className="loading">Carregando tarefas...</div>
        ) : (
          <>
            {tarefas.length === 0 ? (
              <div className="no-tasks">Nenhuma tarefa encontrada</div>
            ) : (
              <div className="tarefas-list">
                {tarefas.map((tarefa) => (
                  <div 
                    key={tarefa.id} 
                    className={`tarefa-item ${tarefa.concluida ? 'concluida' : ''}`}
                  >
                    {editingId === tarefa.id ? (
                      <div className="tarefa-edit">
                        <div className="form-group">
                          <label htmlFor={`edit-titulo-${tarefa.id}`}>Título</label>
                          <input
                            type="text"
                            id={`edit-titulo-${tarefa.id}`}
                            value={editTitulo}
                            onChange={(e) => setEditTitulo(e.target.value)}
                            disabled={loading}
                          />
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor={`edit-descricao-${tarefa.id}`}>Descrição</label>
                          <textarea
                            id={`edit-descricao-${tarefa.id}`}
                            value={editDescricao}
                            onChange={(e) => setEditDescricao(e.target.value)}
                            disabled={loading}
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>
                            <input
                              type="checkbox"
                              checked={editConcluida}
                              onChange={(e) => setEditConcluida(e.target.checked)}
                              disabled={loading}
                            />
                            Concluída
                          </label>
                        </div>
                        
                        <div className="edit-buttons">
                          <button 
                            onClick={() => saveEdit(tarefa.id)} 
                            className="save-button"
                            disabled={loading}
                          >
                            Salvar
                          </button>
                          <button 
                            onClick={cancelEdit} 
                            className="cancel-button"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="tarefa-header">
                          <h3>{tarefa.titulo}</h3>
                          <div className="tarefa-actions">
                            <button 
                              onClick={() => toggleConcluida(tarefa)} 
                              className={`status-button ${tarefa.concluida ? 'uncomplete' : 'complete'}`}
                            >
                              {tarefa.concluida ? 'Reabrir' : 'Concluir'}
                            </button>
                            <button 
                              onClick={() => startEdit(tarefa)} 
                              className="edit-button"
                            >
                              Editar
                            </button>
                            <button 
                              onClick={() => deleteTarefa(tarefa.id)} 
                              className="delete-button"
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                        <p className="tarefa-descricao">{tarefa.descricao}</p>
                        <div className="tarefa-footer">
                          <span className="tarefa-data">
                            Criada em: {new Date(tarefa.data_criacao).toLocaleDateString()}
                          </span>
                          <span className={`tarefa-status ${tarefa.concluida ? 'concluida' : 'pendente'}`}>
                            {tarefa.concluida ? 'Concluída' : 'Pendente'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)} 
                  disabled={currentPage === 1 || loading}
                >
                  Anterior
                </button>
                <span>Página {currentPage} de {totalPages}</span>
                <button 
                  onClick={() => handlePageChange(currentPage + 1)} 
                  disabled={currentPage === totalPages || loading}
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TarefasList;

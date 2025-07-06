import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api.ts';
import '../styles/AuthForm.css';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('1');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !confirmPassword || !nome) {
      setError('Preencha todos os campos');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const response = await authService.register(username, password, nome, tipo);
      setMessage(response.message);
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setNome('');
      setTipo('1');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao registrar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Cadastro de Usuário</h2>
        <p className="admin-notice">Área restrita para administradores</p>
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="username">Nome de Usuário</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Digite o nome de usuário" disabled={loading} />
          </div>
          <div className="form-group">
            <label htmlFor="nome">Nome Completo</label>
            <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Digite o nome completo" disabled={loading} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Digite a senha" disabled={loading} />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirme a senha" disabled={loading} />
          </div>
          <div className="form-group">
            <label htmlFor="tipo">Tipo de Usuário</label>
            <select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} disabled={loading}>
              <option value="1">Usuário</option>
              <option value="0">Administrador</option>
            </select>
          </div>
          <div className="button-group">
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
            <button type="button" className="back-button" onClick={() => navigate('/')}>
              Voltar para Tarefas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

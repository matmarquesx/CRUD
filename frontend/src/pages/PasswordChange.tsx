import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api.ts';
import { useAuth } from '../contexts/auth.tsx';
import '../styles/PasswordChange.css';

const PasswordChange: React.FC = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Preencha todos os campos');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await authService.changePassword(oldPassword, newPassword);
      setMessage(response.message);
      
      // Limpar campos após sucesso
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao alterar senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-change-container">
      <div className="password-change-card">
        <h2>Alteração de Senha</h2>
        <p>Usuário: {user?.username}</p>
        
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        
        <form onSubmit={handleChangePassword}>
          <div className="form-group">
            <label htmlFor="oldPassword">Senha Atual</label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Digite sua senha atual"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="newPassword">Nova Senha</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Digite sua nova senha"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua nova senha"
              disabled={loading}
            />
          </div>
          
          <div className="button-group">
            <button 
              type="submit" 
              className="change-button" 
              disabled={loading}
            >
              {loading ? 'Alterando...' : 'Alterar Senha'}
            </button>
            
            <button 
              type="button" 
              className="back-button"
              onClick={() => navigate('/')}
            >
              Voltar para Tarefas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChange;

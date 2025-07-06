import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api.ts';
import '../styles/PasswordRecover.css';

const PasswordRecover: React.FC = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username) {
      setError('Digite seu nome de usuário');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await authService.recoverPassword(username);
      setMessage(response.message);
      
      // Em ambiente de desenvolvimento, mostrar a senha temporária
      if (response.tempPassword) {
        setMessage(`${response.message}. Senha temporária: ${response.tempPassword}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao recuperar senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recover-container">
      <div className="recover-card">
        <h2>Recuperação de Senha</h2>
        
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        
        <form onSubmit={handleRecover}>
          <div className="form-group">
            <label htmlFor="username">Nome de Usuário</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu nome de usuário"
              disabled={loading || !!message}
            />
          </div>
          
          <div className="button-group">
            <button 
              type="submit" 
              className="recover-button" 
              disabled={loading || !!message}
            >
              {loading ? 'Enviando...' : 'Recuperar Senha'}
            </button>
            
            <button 
              type="button" 
              className="back-button"
              onClick={() => navigate('/login')}
            >
              Voltar para Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordRecover;

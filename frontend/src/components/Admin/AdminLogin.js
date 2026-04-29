import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';

const AdminLogin = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) navigate('/admin/dashboard', { replace: true });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/admin/login', form);
      localStorage.setItem('admin_token', res.data.token);
      navigate('/admin/dashboard', { replace: true });
    } catch {
      setError('Usuário ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__logo">
          <div className="admin-login__logo-mark">Pm</div>
          <div>
            <span className="admin-login__logo-name">PABLO MISLEY</span>
            <span className="admin-login__logo-sub">Área Administrativa</span>
          </div>
        </div>
        <h1 className="admin-login__title">Entrar</h1>
        {error && <p className="admin-login__error">{error}</p>}
        <form onSubmit={handleSubmit} className="admin-login__form">
          <div className="admin-field">
            <label className="admin-label">Usuário</label>
            <input
              className="admin-input"
              type="text"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              required
              autoFocus
            />
          </div>
          <div className="admin-field">
            <label className="admin-label">Senha</label>
            <input
              className="admin-input"
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
            />
          </div>
          <button type="submit" className="admin-btn admin-btn--primary admin-btn--full" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

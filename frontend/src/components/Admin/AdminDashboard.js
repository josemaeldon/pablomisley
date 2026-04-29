import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';
import HeroAdmin from './sections/HeroAdmin';
import PilaresAdmin from './sections/PilaresAdmin';
import ConteudosAdmin from './sections/ConteudosAdmin';
import ProdutosAdmin from './sections/ProdutosAdmin';
import ConfiguracoesAdmin from './sections/ConfiguracoesAdmin';

const SECTIONS = [
  { id: 'hero', label: 'Hero', icon: '🏠' },
  { id: 'pilares', label: 'Pilares', icon: '✝' },
  { id: 'conteudos', label: 'Conteúdos', icon: '📹' },
  { id: 'produtos', label: 'Loja / Produtos', icon: '🛍' },
  { id: 'configuracoes', label: 'Configurações', icon: '⚙️' },
];

const AdminDashboard = () => {
  const [section, setSection] = useState('hero');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { navigate('/admin', { replace: true }); return; }
    axios.get('/api/admin/verify', { headers: { Authorization: `Bearer ${token}` } })
      .catch(() => {
        localStorage.removeItem('admin_token');
        navigate('/admin', { replace: true });
      });
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin', { replace: true });
  };

  const renderSection = () => {
    switch (section) {
      case 'hero': return <HeroAdmin />;
      case 'pilares': return <PilaresAdmin />;
      case 'conteudos': return <ConteudosAdmin />;
      case 'produtos': return <ProdutosAdmin />;
      case 'configuracoes': return <ConfiguracoesAdmin />;
      default: return null;
    }
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <div className="admin-sidebar__logo">
            <div className="admin-sidebar__logo-mark">Pm</div>
            <div className="admin-sidebar__logo-text">
              <span className="admin-sidebar__logo-name">PABLO MISLEY</span>
              <span className="admin-sidebar__logo-sub">Admin</span>
            </div>
          </div>
        </div>
        <nav className="admin-sidebar__nav">
          <p className="admin-sidebar__nav-label">Gerenciar</p>
          {SECTIONS.map(s => (
            <button
              key={s.id}
              className={`admin-nav-item${section === s.id ? ' admin-nav-item--active' : ''}`}
              onClick={() => setSection(s.id)}
            >
              <span>{s.icon}</span>
              {s.label}
            </button>
          ))}
          <p className="admin-sidebar__nav-label" style={{ marginTop: 16 }}>Site</p>
          <a href="/" target="_blank" rel="noreferrer" className="admin-nav-item" style={{ textDecoration: 'none' }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Ver site
          </a>
        </nav>
        <div className="admin-sidebar__footer">
          <button className="admin-btn admin-btn--outline admin-btn--full" onClick={logout}>
            Sair
          </button>
        </div>
      </aside>
      <main className="admin-main">
        {renderSection()}
      </main>
    </div>
  );
};

export default AdminDashboard;

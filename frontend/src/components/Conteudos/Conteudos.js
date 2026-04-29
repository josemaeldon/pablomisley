import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Conteudos.css';

const DEFAULTS = [
  { id: 1, categoria: 'HOMILIAS', titulo: 'Homilias', descricao: 'Homilias que tocam o coração e iluminam o caminho.', tipo: 'video', imagem_url: '' },
  { id: 2, categoria: 'REFLEXÕES', titulo: 'Reflexões', descricao: 'Reflexões diárias para fortalecer sua caminhada.', tipo: 'article', imagem_url: '' },
  { id: 3, categoria: 'VÍDEOS', titulo: 'Vídeos', descricao: 'Assista e compartilhe mensagens de fé e esperança.', tipo: 'video', imagem_url: '' },
  { id: 4, categoria: 'FORMAÇÃO', titulo: 'Formação', descricao: 'Formação católica para viver sua fé com profundidade.', tipo: 'course', imagem_url: '' },
];

function ContentIcon({ tipo }) {
  if (tipo === 'article') return (
    <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/>
      <line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/>
    </svg>
  );
  if (tipo === 'course') return (
    <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  );
  return (
    <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
    </svg>
  );
}

const Conteudos = () => {
  const navigate = useNavigate();
  const [conteudos, setConteudos] = useState(DEFAULTS);

  useEffect(() => {
    axios.get('/api/conteudos').then(r => r.data?.length && setConteudos(r.data)).catch(() => {});
  }, []);

  const imgSrc = (url) => url && url.trim() ? url : null;

  return (
    <main className="conteudos-page">
      <div className="container">
        <div className="conteudos-page__header">
          <button className="conteudos-page__back" onClick={() => navigate('/')}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Voltar
          </button>
          <div className="conteudos-page__title-wrap">
            <div className="conteudos-page__accent" />
            <h1 className="conteudos-page__title">Todos os Conteúdos</h1>
          </div>
        </div>
        <div className="conteudos-page__grid">
          {conteudos.map(c => (
            <div key={c.id} className="conteudo-card">
              <div className="conteudo-card__thumb">
                {imgSrc(c.imagem_url) ? (
                  <img src={imgSrc(c.imagem_url)} alt={c.titulo} />
                ) : (
                  <div className="conteudo-card__placeholder" />
                )}
                <div className="conteudo-card__icon">
                  <ContentIcon tipo={c.tipo} />
                </div>
              </div>
              <div className="conteudo-card__body">
                <span className="conteudo-card__cat">{c.categoria}</span>
                <p className="conteudo-card__desc">{c.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Conteudos;

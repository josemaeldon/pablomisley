import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Loja.css';

const DEFAULTS = [
  { id: 1, nome: 'Imitação de Cristo', preco: 49.90, imagem_url: '' },
  { id: 2, nome: 'Terço de São Bento', preco: 34.90, imagem_url: '' },
  { id: 3, nome: 'Imagem de Nossa Senhora Aparecida', preco: 89.90, imagem_url: '' },
  { id: 4, nome: 'Caneca Deus é meu refúgio', preco: 39.90, imagem_url: '' },
];

const Loja = () => {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState(DEFAULTS);
  const [lojaTitle, setLojaTitle] = useState('Artigos que ajudam você a viver sua fé todos os dias.');

  useEffect(() => {
    axios.get('/api/produtos').then(r => r.data?.length && setProdutos(r.data)).catch(() => {});
    axios.get('/api/configuracoes').then(r => {
      if (r.data?.loja_titulo) setLojaTitle(r.data.loja_titulo);
    }).catch(() => {});
  }, []);

  const imgSrc = (url) => url && url.trim() ? url : null;

  return (
    <main className="loja-page">
      <div className="container">
        <div className="loja-page__header">
          <button className="loja-page__back" onClick={() => navigate('/')}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Voltar
          </button>
          <div className="loja-page__title-wrap">
            <div className="loja-page__icon">
              <svg width="28" height="28" fill="none" stroke="#c9a435" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <div>
              <span className="loja-page__label">Loja</span>
              <h1 className="loja-page__title">{lojaTitle}</h1>
            </div>
          </div>
        </div>
        <div className="loja-page__grid">
          {produtos.map(p => (
            <div key={p.id} className="produto-card">
              <div className="produto-card__img">
                {imgSrc(p.imagem_url) ? (
                  <img src={imgSrc(p.imagem_url)} alt={p.nome} />
                ) : (
                  <div className="produto-card__placeholder" />
                )}
              </div>
              <p className="produto-card__nome">{p.nome}</p>
              <p className="produto-card__preco">
                R$ {parseFloat(p.preco).toFixed(2).replace('.', ',')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Loja;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const DEFAULTS = {
  hero: {
    titulo: 'Tudo para a glória de Deus.',
    subtitulo: '"Para mim, o viver é Cristo" (Filipenses 1,21)',
    descricao: 'Padre Pablo Misley, sacerdote católico, dedica sua vida à evangelização através da música, da Palavra e do serviço.',
    btn1_texto: 'CONHEÇA MINHA HISTÓRIA',
    btn2_texto: 'ACOMPANHE OS CONTEÚDOS',
    imagem_url: '',
  },
  pilares: [
    { id: 1, icone: 'chalice', titulo: 'Eucaristia', descricao: 'Fonte e centro da minha vida e missão.' },
    { id: 2, icone: 'book', titulo: 'Palavra', descricao: 'Anunciar o Evangelho com fidelidade e amor.' },
    { id: 3, icone: 'people', titulo: 'Comunhão', descricao: 'Caminhar com o povo de Deus em unidade.' },
    { id: 4, icone: 'heart', titulo: 'Caridade', descricao: 'Servir a todos com misericórdia e esperança.' },
  ],
  conteudos: [
    { id: 1, categoria: 'HOMILIAS', titulo: 'Homilias', descricao: 'Homilias que tocam o coração e iluminam o caminho.', tipo: 'video', imagem_url: '' },
    { id: 2, categoria: 'REFLEXÕES', titulo: 'Reflexões', descricao: 'Reflexões diárias para fortalecer sua caminhada.', tipo: 'article', imagem_url: '' },
    { id: 3, categoria: 'VÍDEOS', titulo: 'Vídeos', descricao: 'Assista e compartilhe mensagens de fé e esperança.', tipo: 'video', imagem_url: '' },
    { id: 4, categoria: 'FORMAÇÃO', titulo: 'Formação', descricao: 'Formação católica para viver sua fé com profundidade.', tipo: 'course', imagem_url: '' },
  ],
  produtos: [
    { id: 1, nome: 'Imitação de Cristo', preco: 49.90, imagem_url: '' },
    { id: 2, nome: 'Terço de São Bento', preco: 34.90, imagem_url: '' },
    { id: 3, nome: 'Imagem de Nossa Senhora Aparecida', preco: 89.90, imagem_url: '' },
    { id: 4, nome: 'Caneca Deus é meu refúgio', preco: 39.90, imagem_url: '' },
  ],
  config: {
    newsletter_texto: 'Receba novidades e conteúdos exclusivos no seu e-mail!',
    citacao_texto: 'Tudo posso naquele que me fortalece.',
    citacao_referencia: 'FILIPENSES 4,13',
    loja_titulo: 'Artigos que ajudam você a viver sua fé todos os dias.',
    footer_descricao: 'Sacerdote católico, missionário, servo da Palavra e do Altar.',
    newsletter_imagem: '',
    citacao_imagem: '',
  },
};

function PilarIcon({ icone }) {
  switch (icone) {
    case 'chalice': return (
      <svg width="32" height="32" fill="none" stroke="#c9a435" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M8 2h8l-1 7a5 5 0 0 1-6 0L8 2z"/><line x1="12" y1="9" x2="12" y2="16"/>
        <line x1="8" y1="16" x2="16" y2="16"/>
      </svg>
    );
    case 'book': return (
      <svg width="32" height="32" fill="none" stroke="#c9a435" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    );
    case 'people': return (
      <svg width="32" height="32" fill="none" stroke="#c9a435" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    );
    case 'heart': return (
      <svg width="32" height="32" fill="none" stroke="#c9a435" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    );
    default: return (
      <svg width="32" height="32" fill="none" stroke="#c9a435" strokeWidth="1.5" viewBox="0 0 24 24">
        <line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/>
      </svg>
    );
  }
}

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

const Home = () => {
  const navigate = useNavigate();
  const [hero, setHero] = useState(DEFAULTS.hero);
  const [pilares, setPilares] = useState(DEFAULTS.pilares);
  const [conteudos, setConteudos] = useState(DEFAULTS.conteudos);
  const [produtos, setProdutos] = useState(DEFAULTS.produtos);
  const [config, setConfig] = useState(DEFAULTS.config);
  const [email, setEmail] = useState('');
  const [carouselIdx, setCarouselIdx] = useState(0);
  const visibleProducts = 4;
  const carouselRef = useRef(null);

  useEffect(() => {
    axios.get('/api/hero').then(r => r.data && r.data.id && setHero(r.data)).catch(() => {});
    axios.get('/api/pilares').then(r => r.data?.length && setPilares(r.data)).catch(() => {});
    axios.get('/api/conteudos').then(r => r.data?.length && setConteudos(r.data)).catch(() => {});
    axios.get('/api/produtos').then(r => r.data?.length && setProdutos(r.data)).catch(() => {});
    axios.get('/api/configuracoes').then(r => r.data && setConfig(c => ({ ...c, ...r.data }))).catch(() => {});
  }, []);

  const maxIdx = Math.max(0, produtos.length - visibleProducts);
  const prevSlide = () => setCarouselIdx(i => Math.max(0, i - 1));
  const nextSlide = () => setCarouselIdx(i => Math.min(maxIdx, i + 1));

  const imgSrc = (url, fallback) => url && url.trim() ? url : fallback || null;

  const heroTitle = hero.titulo || DEFAULTS.hero.titulo;
  const titleParts = heroTitle.split(/(glória de Deus\.|glória de Deus)/i);

  return (
    <main className="home" id="inicio">
      {/* ── HERO ── */}
      <section className="hero">
        {imgSrc(hero.imagem_url) && (
          <div className="hero__bg">
            <img src={imgSrc(hero.imagem_url)} alt="Padre Pablo Misley" className="hero__bg-img" />
            <div className="hero__bg-fade" />
          </div>
        )}
        <div className="container hero__inner">
          <div className="hero__content">
            <span className="hero__cross">+</span>
            <h1 className="hero__title">
              {titleParts[0]}
              {titleParts[1] && <span className="hero__title--gold">{titleParts[1]}</span>}
              {titleParts[2]}
            </h1>
            <p className="hero__quote">{hero.subtitulo || DEFAULTS.hero.subtitulo}</p>
            <p className="hero__desc">{hero.descricao || DEFAULTS.hero.descricao}</p>
            <div className="hero__btns">
              <button className="btn btn--primary">{hero.btn1_texto || DEFAULTS.hero.btn1_texto} →</button>
              <button className="btn btn--outline">{hero.btn2_texto || DEFAULTS.hero.btn2_texto}</button>
            </div>
          </div>
          <div className="hero__image-wrap">
            {!imgSrc(hero.imagem_url) && (
              <div className="hero__image-placeholder">
                <svg width="80" height="80" fill="none" stroke="#c9a435" strokeWidth="1" viewBox="0 0 24 24" opacity="0.4">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── PILARES ── */}
      <section className="pilares" id="missao">
        <div className="container">
          <div className="pilares__grid">
            {pilares.map(p => (
              <div key={p.id} className="pilar">
                <div className="pilar__icon-wrap">
                  <PilarIcon icone={p.icone} />
                </div>
                <div>
                  <h3 className="pilar__title">{p.titulo}</h3>
                  <p className="pilar__desc">{p.descricao}</p>
                  <div className="pilar__line" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTEÚDOS ── */}
      <section className="conteudos" id="conteudos">
        <div className="container">
          <div className="conteudos__header">
            <div className="conteudos__title-wrap">
              <div className="conteudos__accent" />
              <h2 className="conteudos__title">Conteúdos para alimentar sua fé</h2>
            </div>
            <button className="btn btn--ver" onClick={() => navigate('/conteudos')}>VER TODOS OS CONTEÚDOS</button>
          </div>
          <div className="conteudos__grid">
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
      </section>

      {/* ── LOJA ── */}
      <section className="loja" id="loja">
        <div className="container loja__inner">
          <div className="loja__info">
            <div className="loja__icon">
              <svg width="28" height="28" fill="none" stroke="#c9a435" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <span className="loja__label">Loja</span>
            <h2 className="loja__title">{config.loja_titulo || DEFAULTS.config.loja_titulo}</h2>
            <button className="btn btn--primary" onClick={() => navigate('/loja')}>IR PARA A LOJA</button>
          </div>
          <div className="loja__carousel-wrap">
            <button className="loja__arrow loja__arrow--prev" onClick={prevSlide} disabled={carouselIdx === 0}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <div className="loja__carousel" ref={carouselRef}>
              <div className="loja__track" style={{ transform: `translateX(-${carouselIdx * (100 / visibleProducts)}%)` }}>
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
            <button className="loja__arrow loja__arrow--next" onClick={nextSlide} disabled={carouselIdx >= maxIdx}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER + CITAÇÃO ── */}
      <section className="banner">
        <div className="banner__newsletter">
          <div className="banner__newsletter-icon">
            <svg width="32" height="32" fill="none" stroke="#c9a435" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <p className="banner__newsletter-text">{config.newsletter_texto || DEFAULTS.config.newsletter_texto}</p>
          <form className="banner__form" onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="banner__input"
            />
            <button type="submit" className="banner__submit">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </form>
        </div>
        <div
          className="banner__citacao"
          style={imgSrc(config.citacao_imagem) ? { backgroundImage: `url(${imgSrc(config.citacao_imagem)})` } : {}}
        >
          <div className="banner__citacao-inner">
            <span className="banner__quote-mark">"</span>
            <p className="banner__quote-text">{config.citacao_texto || DEFAULTS.config.citacao_texto}</p>
            <p className="banner__quote-ref">{config.citacao_referencia || DEFAULTS.config.citacao_referencia}</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;

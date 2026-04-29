import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="header__logo">
          <div className="header__logo-mark">
            <span className="header__logo-pm">Pm</span>
          </div>
          <div className="header__logo-text">
            <span className="header__logo-name">PABLO MISLEY</span>
            <span className="header__logo-title">PADRE</span>
          </div>
        </Link>

        <button className="header__burger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>

        <nav className={`header__nav${menuOpen ? ' header__nav--open' : ''}`}>
          <ul className="header__nav-list">
            <li><a href="#inicio" className="header__nav-link header__nav-link--active">Início</a></li>
            <li><a href="#sobre" className="header__nav-link">Sobre</a></li>
            <li><a href="#missao" className="header__nav-link">Missão</a></li>
            <li><a href="#conteudos" className="header__nav-link">Conteúdos</a></li>
            <li><a href="#loja" className="header__nav-link">Loja</a></li>
            <li><a href="#agenda" className="header__nav-link">Agenda</a></li>
            <li><a href="#contato" className="header__nav-link">Contato</a></li>
          </ul>
        </nav>

        <div className="header__actions">
          <button className="header__icon-btn" aria-label="Buscar">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
          <button className="header__icon-btn" aria-label="Conta">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </button>
          <button className="header__icon-btn header__cart-btn" aria-label="Carrinho">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span className="header__cart-count">0</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

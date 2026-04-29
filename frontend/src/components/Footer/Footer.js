import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer className="footer" id="contato">
    <div className="footer__main">
      <div className="container footer__grid">
        <div className="footer__brand">
          <div className="footer__logo">
            <div className="footer__logo-mark"><span className="footer__logo-pm">Pm</span></div>
            <div>
              <span className="footer__logo-name">PABLO MISLEY</span>
              <span className="footer__logo-title">PADRE</span>
            </div>
          </div>
          <p className="footer__brand-desc">Sacerdote católico, missionário, servo da Palavra e do Altar.</p>
          <div className="footer__social">
            <a href="#inicio" aria-label="Instagram" className="footer__social-link">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
              </svg>
            </a>
            <a href="#inicio" aria-label="YouTube" className="footer__social-link">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a href="#inicio" aria-label="Facebook" className="footer__social-link">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="#inicio" aria-label="Spotify" className="footer__social-link">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <path d="M8 13.5c2.5-1 5.5-1 8 .5M7 10.5c3.5-1.5 7.5-1.5 11 .5M9 16.5c2-0.7 4-0.7 6 0"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="footer__col">
          <h4 className="footer__col-title">NAVEGAÇÃO</h4>
          <ul className="footer__links">
            <li><a href="#inicio">Início</a></li>
            <li><a href="#sobre">Sobre</a></li>
            <li><a href="#missao">Missão</a></li>
            <li><a href="#conteudos">Conteúdos</a></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4 className="footer__col-title">LOJA</h4>
          <ul className="footer__links">
            <li><a href="#loja">Livros</a></li>
            <li><a href="#loja">Terços</a></li>
            <li><a href="#loja">Imagens</a></li>
            <li><a href="#loja">Devocionais</a></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4 className="footer__col-title">CONTATO</h4>
          <ul className="footer__links footer__links--contact">
            <li>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              contato@patnlomisley.com.br
            </li>
            <li>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6.92 6.92l.82-.82a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              (91) 99999-9999
            </li>
            <li>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              Bragança - PA
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div className="footer__bottom">
      <div className="container footer__bottom-inner">
        <p>© 2024 Padre Misley. Todos os direitos reservados.</p>
        <p>Feito para a glória de Deus! ✝</p>
        <div className="footer__bottom-links">
          <a href="#inicio">Política de Privacidade</a>
          <a href="#inicio">Termos de Uso</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;

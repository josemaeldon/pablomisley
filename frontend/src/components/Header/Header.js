import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <h1>Pablo Misley</h1>
          <p>Padre</p>
        </div>
        <nav className="nav">
          <ul>
            <li><a href="#">Início</a></li>
            <li><a href="#">Sobre</a></li>
            <li><a href="#">Missão</a></li>
            <li><a href="#">Conteúdos</a></li>
            <li><a href="#">Loja</a></li>
            <li><a href="#">Agenda</a></li>
            <li><a href="#">Contato</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
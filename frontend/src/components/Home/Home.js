import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <main className="home">
      <section className="hero">
        <div className="container">
          <h1>Tudo para a glória de Deus.</h1>
          <p>"Para mim, o viver é Cristo" (Filipenses 1,21)</p>
          <p>Padre Pablo Misley, sacerdote católico, dedica sua vida à evangelização através da música, da Palavra e do serviço.</p>
          <button>Conheça minha história</button>
          <button>Acompanhe os conteúdos</button>
        </div>
      </section>
      <section className="content">
        <div className="container">
          <h2>Conteúdos para alimentar sua fé</h2>
          <div className="content-grid">
            <div className="content-item">Homilias</div>
            <div className="content-item">Reflexões</div>
            <div className="content-item">Vídeos</div>
            <div className="content-item">Formação</div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
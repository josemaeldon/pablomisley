import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ImageUpload from '../ImageUpload';

const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('admin_token')}` });

const EMPTY_SLIDE = {
  ordem: 1,
  titulo: '',
  subtitulo: '',
  descricao: '',
  btn1_texto: '',
  btn2_texto: '',
  imagem_url: '',
};

const HeroAdmin = () => {
  const [slides, setSlides] = useState([EMPTY_SLIDE]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    axios.get('/api/admin/hero-slides', { headers: authHeader() })
      .then(r => {
        const data = Array.isArray(r.data) && r.data.length ? r.data.slice(0, 4) : [EMPTY_SLIDE];
        setSlides(data.map((slide, index) => ({ ...EMPTY_SLIDE, ...slide, ordem: slide.ordem || index + 1 })));
      })
      .catch(() => {});
  }, []);

  const set = (index, key, value) => setSlides(current => current.map((slide, slideIndex) => (
    slideIndex === index ? { ...slide, [key]: value } : slide
  )));

  const addSlide = () => setSlides(current => (
    current.length >= 4 ? current : [...current, { ...EMPTY_SLIDE, ordem: current.length + 1 }]
  ));

  const removeSlide = (index) => setSlides(current => current.length === 1 ? current : current.filter((_, slideIndex) => slideIndex !== index));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put('/api/admin/hero-slides', { slides }, { headers: authHeader() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch { alert('Erro ao salvar.'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <h1 className="admin-page-title">Hero</h1>
      <div className="admin-card">
        <form onSubmit={handleSave}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {slides.map((slide, index) => (
              <div key={index} className="admin-card" style={{ marginBottom: 0, padding: 16, background: '#fcfbf8' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
                  <h2 className="admin-card__title" style={{ margin: 0 }}>Slide {index + 1}</h2>
                  {slides.length > 1 && (
                    <button type="button" className="admin-btn admin-btn--outline" onClick={() => removeSlide(index)}>
                      Remover
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="admin-field">
                    <label className="admin-label">Título</label>
                    <input className="admin-input" value={slide.titulo} onChange={e => set(index, 'titulo', e.target.value)} placeholder="Tudo para a glória de Deus." />
                  </div>
                  <div className="admin-field">
                    <label className="admin-label">Subtítulo / Citação</label>
                    <input className="admin-input" value={slide.subtitulo} onChange={e => set(index, 'subtitulo', e.target.value)} placeholder='"Para mim, o viver é Cristo"' />
                  </div>
                  <div className="admin-field">
                    <label className="admin-label">Descrição</label>
                    <textarea className="admin-textarea" value={slide.descricao} onChange={e => set(index, 'descricao', e.target.value)} />
                  </div>
                  <div className="admin-form-grid">
                    <div className="admin-field">
                      <label className="admin-label">Texto Botão 1</label>
                      <input className="admin-input" value={slide.btn1_texto} onChange={e => set(index, 'btn1_texto', e.target.value)} />
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">Texto Botão 2</label>
                      <input className="admin-input" value={slide.btn2_texto} onChange={e => set(index, 'btn2_texto', e.target.value)} />
                    </div>
                  </div>
                  <ImageUpload label="Foto do Slide" value={slide.imagem_url} onChange={v => set(index, 'imagem_url', v)} />
                </div>
              </div>
            ))}
            {slides.length < 4 && (
              <button type="button" className="admin-btn admin-btn--outline" onClick={addSlide} style={{ alignSelf: 'flex-start' }}>
                Adicionar slide
              </button>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar alterações'}
              </button>
              {saved && <span style={{ color: '#16a34a', fontSize: 13, fontWeight: 600 }}>✓ Salvo!</span>}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HeroAdmin;

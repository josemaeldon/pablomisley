import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ImageUpload from '../ImageUpload';

const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('admin_token')}` });

const HeroAdmin = () => {
  const [form, setForm] = useState({ titulo: '', subtitulo: '', descricao: '', btn1_texto: '', btn2_texto: '', imagem_url: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    axios.get('/api/admin/hero', { headers: authHeader() })
      .then(r => r.data && r.data.id && setForm(r.data))
      .catch(() => {});
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put('/api/admin/hero', form, { headers: authHeader() });
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
            <div className="admin-field">
              <label className="admin-label">Título</label>
              <input className="admin-input" value={form.titulo} onChange={e => set('titulo', e.target.value)} placeholder="Tudo para a glória de Deus." />
            </div>
            <div className="admin-field">
              <label className="admin-label">Subtítulo / Citação</label>
              <input className="admin-input" value={form.subtitulo} onChange={e => set('subtitulo', e.target.value)} placeholder='"Para mim, o viver é Cristo"' />
            </div>
            <div className="admin-field">
              <label className="admin-label">Descrição</label>
              <textarea className="admin-textarea" value={form.descricao} onChange={e => set('descricao', e.target.value)} />
            </div>
            <div className="admin-form-grid">
              <div className="admin-field">
                <label className="admin-label">Texto Botão 1</label>
                <input className="admin-input" value={form.btn1_texto} onChange={e => set('btn1_texto', e.target.value)} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Texto Botão 2</label>
                <input className="admin-input" value={form.btn2_texto} onChange={e => set('btn2_texto', e.target.value)} />
              </div>
            </div>
            <ImageUpload label="Foto do Padre (Hero)" value={form.imagem_url} onChange={v => set('imagem_url', v)} />
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

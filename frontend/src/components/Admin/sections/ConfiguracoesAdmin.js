import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ImageUpload from '../ImageUpload';

const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('admin_token')}` });

const DEFAULTS = {
  newsletter_texto: '',
  citacao_texto: '',
  citacao_referencia: '',
  loja_titulo: '',
  footer_descricao: '',
  logo_imagem: '',
  newsletter_imagem: '',
  citacao_imagem: '',
};

const ConfiguracoesAdmin = () => {
  const [form, setForm] = useState(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    axios.get('/api/admin/configuracoes', { headers: authHeader() })
      .then(r => r.data && setForm(f => ({ ...f, ...r.data })))
      .catch(() => {});
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put('/api/admin/configuracoes', form, { headers: authHeader() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch { alert('Erro ao salvar.'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <h1 className="admin-page-title">Configurações</h1>
      <form onSubmit={handleSave}>
        <div className="admin-card" style={{ marginBottom: 16 }}>
          <h2 className="admin-card__title" style={{ marginBottom: 20 }}>Seção Newsletter</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="admin-field">
              <label className="admin-label">Texto da Newsletter</label>
              <textarea className="admin-textarea" value={form.newsletter_texto}
                onChange={e => set('newsletter_texto', e.target.value)} />
            </div>
            <ImageUpload label="Imagem da Newsletter (opcional)" value={form.newsletter_imagem}
              onChange={v => set('newsletter_imagem', v)} />
          </div>
        </div>

        <div className="admin-card" style={{ marginBottom: 16 }}>
          <h2 className="admin-card__title" style={{ marginBottom: 20 }}>Seção Citação</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="admin-field">
              <label className="admin-label">Texto da Citação</label>
              <textarea className="admin-textarea" value={form.citacao_texto}
                onChange={e => set('citacao_texto', e.target.value)} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Referência (ex: FILIPENSES 4,13)</label>
              <input className="admin-input" value={form.citacao_referencia}
                onChange={e => set('citacao_referencia', e.target.value)} />
            </div>
            <ImageUpload label="Imagem de Fundo da Citação" value={form.citacao_imagem}
              onChange={v => set('citacao_imagem', v)} />
          </div>
        </div>

        <div className="admin-card" style={{ marginBottom: 16 }}>
          <h2 className="admin-card__title" style={{ marginBottom: 20 }}>Seção Loja</h2>
          <div className="admin-field">
            <label className="admin-label">Texto descritivo da Loja</label>
            <textarea className="admin-textarea" value={form.loja_titulo}
              onChange={e => set('loja_titulo', e.target.value)} />
          </div>
        </div>

        <div className="admin-card" style={{ marginBottom: 16 }}>
          <h2 className="admin-card__title" style={{ marginBottom: 20 }}>Logo do Site</h2>
          <ImageUpload label="Imagem da Logo (substitui o texto Pm)" value={form.logo_imagem}
            onChange={v => set('logo_imagem', v)} />
        </div>

        <div className="admin-card" style={{ marginBottom: 24 }}>
          <h2 className="admin-card__title" style={{ marginBottom: 20 }}>Rodapé</h2>
          <div className="admin-field">
            <label className="admin-label">Descrição do Padre (Footer)</label>
            <textarea className="admin-textarea" value={form.footer_descricao}
              onChange={e => set('footer_descricao', e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar configurações'}
          </button>
          {saved && <span style={{ color: '#16a34a', fontSize: 13, fontWeight: 600 }}>✓ Salvo!</span>}
        </div>
      </form>
    </div>
  );
};

export default ConfiguracoesAdmin;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ImageUpload from '../ImageUpload';

const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('admin_token')}` });
const EMPTY = { imagem_url: '', nome: '', preco: '', ordem: 0 };

const ProdutosAdmin = () => {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const load = () =>
    axios.get('/api/admin/produtos', { headers: authHeader() }).then(r => setItems(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setModal({ type: 'add' }); };
  const openEdit = (item) => { setForm({ ...item, preco: String(item.preco) }); setModal({ type: 'edit', id: item.id }); };
  const closeModal = () => setModal(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, preco: parseFloat(form.preco) || 0 };
    try {
      if (modal.type === 'add') {
        await axios.post('/api/admin/produtos', payload, { headers: authHeader() });
      } else {
        await axios.put(`/api/admin/produtos/${modal.id}`, payload, { headers: authHeader() });
      }
      await load();
      closeModal();
    } catch { alert('Erro ao salvar.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/admin/produtos/${confirm}`, { headers: authHeader() });
      await load();
    } catch { alert('Erro ao excluir.'); }
    finally { setConfirm(null); }
  };

  return (
    <div>
      <h1 className="admin-page-title">Loja / Produtos</h1>
      <div className="admin-card">
        <div className="admin-card__header">
          <h2 className="admin-card__title">Lista de Produtos</h2>
          <button className="admin-btn admin-btn--primary" onClick={openAdd}>+ Adicionar</button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Imagem</th><th>Nome</th><th>Preço</th><th>Ordem</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>
                    {item.imagem_url
                      ? <img src={item.imagem_url} alt={item.nome} className="admin-table__thumb" />
                      : <div className="admin-table__thumb-placeholder" />}
                  </td>
                  <td><strong>{item.nome}</strong></td>
                  <td>R$ {parseFloat(item.preco).toFixed(2).replace('.', ',')}</td>
                  <td>{item.ordem}</td>
                  <td>
                    <div className="admin-table__actions">
                      <button className="admin-btn admin-btn--secondary admin-btn--sm" onClick={() => openEdit(item)}>Editar</button>
                      <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => setConfirm(item.id)}>Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="admin-modal">
            <div className="admin-modal__header">
              <h3 className="admin-modal__title">{modal.type === 'add' ? 'Adicionar Produto' : 'Editar Produto'}</h3>
              <button className="admin-modal__close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="admin-modal__body">
                <ImageUpload label="Imagem do Produto" value={form.imagem_url} onChange={v => set('imagem_url', v)} />
                <div className="admin-field">
                  <label className="admin-label">Nome *</label>
                  <input className="admin-input" value={form.nome} onChange={e => set('nome', e.target.value)} required />
                </div>
                <div className="admin-form-grid">
                  <div className="admin-field">
                    <label className="admin-label">Preço (R$) *</label>
                    <input className="admin-input" type="number" step="0.01" min="0" value={form.preco}
                      onChange={e => set('preco', e.target.value)} required />
                  </div>
                  <div className="admin-field">
                    <label className="admin-label">Ordem</label>
                    <input className="admin-input" type="number" value={form.ordem}
                      onChange={e => set('ordem', parseInt(e.target.value) || 0)} />
                  </div>
                </div>
              </div>
              <div className="admin-modal__footer">
                <button type="button" className="admin-btn admin-btn--secondary" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirm && (
        <div className="admin-modal-overlay">
          <div className="admin-confirm">
            <div className="admin-confirm__icon">🗑</div>
            <h3>Excluir Produto</h3>
            <p>Tem certeza que deseja excluir este produto?</p>
            <div className="admin-confirm__btns">
              <button className="admin-btn admin-btn--secondary" onClick={() => setConfirm(null)}>Cancelar</button>
              <button className="admin-btn admin-btn--danger" onClick={handleDelete}>Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProdutosAdmin;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('admin_token')}` });
const EMPTY = { icone: 'cross', titulo: '', descricao: '', ordem: 0 };
const ICONS = ['chalice', 'book', 'people', 'heart', 'cross'];

const PilaresAdmin = () => {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(null); // null | { type: 'add'|'edit', data }
  const [confirm, setConfirm] = useState(null); // id to delete
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const load = () => axios.get('/api/admin/pilares', { headers: authHeader() }).then(r => setItems(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setModal({ type: 'add' }); };
  const openEdit = (item) => { setForm({ ...item }); setModal({ type: 'edit', id: item.id }); };
  const closeModal = () => setModal(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal.type === 'add') {
        await axios.post('/api/admin/pilares', form, { headers: authHeader() });
      } else {
        await axios.put(`/api/admin/pilares/${modal.id}`, form, { headers: authHeader() });
      }
      await load();
      closeModal();
    } catch { alert('Erro ao salvar.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/admin/pilares/${confirm}`, { headers: authHeader() });
      await load();
    } catch { alert('Erro ao excluir.'); }
    finally { setConfirm(null); }
  };

  return (
    <div>
      <h1 className="admin-page-title">Pilares</h1>
      <div className="admin-card">
        <div className="admin-card__header">
          <h2 className="admin-card__title">Lista de Pilares</h2>
          <button className="admin-btn admin-btn--primary" onClick={openAdd}>+ Adicionar</button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Ícone</th><th>Título</th><th>Descrição</th><th>Ordem</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>{item.icone}</td>
                  <td><strong>{item.titulo}</strong></td>
                  <td style={{ maxWidth: 240 }}>{item.descricao}</td>
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

      {/* Modal */}
      {modal && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="admin-modal">
            <div className="admin-modal__header">
              <h3 className="admin-modal__title">{modal.type === 'add' ? 'Adicionar Pilar' : 'Editar Pilar'}</h3>
              <button className="admin-modal__close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="admin-modal__body">
                <div className="admin-field">
                  <label className="admin-label">Ícone</label>
                  <select className="admin-select" value={form.icone} onChange={e => set('icone', e.target.value)}>
                    {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div className="admin-field">
                  <label className="admin-label">Título *</label>
                  <input className="admin-input" value={form.titulo} onChange={e => set('titulo', e.target.value)} required />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Descrição</label>
                  <textarea className="admin-textarea" value={form.descricao} onChange={e => set('descricao', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Ordem</label>
                  <input className="admin-input" type="number" value={form.ordem} onChange={e => set('ordem', parseInt(e.target.value) || 0)} />
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

      {/* Confirm delete */}
      {confirm && (
        <div className="admin-modal-overlay">
          <div className="admin-confirm">
            <div className="admin-confirm__icon">🗑</div>
            <h3>Excluir Pilar</h3>
            <p>Tem certeza que deseja excluir este pilar? Esta ação não pode ser desfeita.</p>
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

export default PilaresAdmin;

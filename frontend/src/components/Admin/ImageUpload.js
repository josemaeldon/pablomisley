import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = ({ value, onChange, label = 'Imagem' }) => {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append('image', file);
      const token = localStorage.getItem('admin_token');
      const res = await axios.post('/api/admin/upload', data, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      onChange(res.data.url);
    } catch {
      alert('Erro ao enviar imagem.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-img-upload">
      <label className="admin-label">{label}</label>
      {value && (
        <div className="admin-img-preview">
          <img src={value} alt="preview" />
          <button type="button" className="admin-img-preview__remove" onClick={() => onChange('')} title="Remover">×</button>
        </div>
      )}
      {uploading ? (
        <span className="admin-img-uploading">Enviando...</span>
      ) : (
        <label className="admin-img-upload-btn">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          {value ? 'Trocar imagem' : 'Escolher imagem'}
          <input type="file" accept="image/*" onChange={handleFile} />
        </label>
      )}
    </div>
  );
};

export default ImageUpload;

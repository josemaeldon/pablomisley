import React, { useState } from 'react';
import axios from 'axios';

const SetupForm = () => {
  const [formData, setFormData] = useState({
    host: '',
    user: '',
    password: '',
    database: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/setup', formData);
      alert(response.data);
    } catch (error) {
      alert('Erro ao configurar o banco de dados.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Host:
        <input type="text" name="host" value={formData.host} onChange={handleChange} required />
      </label>
      <label>
        Usuário:
        <input type="text" name="user" value={formData.user} onChange={handleChange} required />
      </label>
      <label>
        Senha:
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
      </label>
      <label>
        Banco de Dados:
        <input type="text" name="database" value={formData.database} onChange={handleChange} required />
      </label>
      <button type="submit">Configurar</button>
    </form>
  );
};

export default SetupForm;
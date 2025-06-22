import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      if (data.rol === 'CIUDADANO') navigate('/votante');
      else if (data.rol === 'FUNCIONARIO') navigate('/funcionario');
      else if (data.rol === 'ADMIN') navigate('/admin');
      else setMensaje('Rol no reconocido');
    } else {
      setMensaje(data.error || 'Error de autenticación');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Usuario" className="border p-2" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" className="border p-2" />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">Entrar</button>
        {mensaje && <p className="text-red-600 mt-2">{mensaje}</p>}
      </form>
    </div>
  );
}

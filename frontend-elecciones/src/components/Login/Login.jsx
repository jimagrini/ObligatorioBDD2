import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

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
<div className="login-container">
<h1 className="login-title">Bienvenido al sistema electoral</h1>
<h2 className="login-subtitle">Iniciar Sesión</h2>
<form onSubmit={handleSubmit} className="login-form">
<input
value={username}
onChange={e => setUsername(e.target.value)}
placeholder="Usuario"
className="login-input"
required
/>
<input
type="password"
value={password}
onChange={e => setPassword(e.target.value)}
placeholder="Contraseña"
className="login-input"
required
/>
<button type="submit" className="login-button">Entrar</button>
{mensaje && <p className="login-error">{mensaje}</p>}
</form>
</div>
);
}

import React, { useState } from 'react';
import './RegistroCiudadano.css';

function RegistroCiudadano() {
const [ci, setCi] = useState('');
const [nombre, setNombre] = useState('');
const [fechaNac, setFechaNac] = useState('');
const [cc, setCc] = useState('');
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [mensaje, setMensaje] = useState('');

const handleSubmit = async (e) => {
e.preventDefault();

const data = {
  ci,
  nombre,
  fecha_nac: fechaNac,
  cc,
  username,
  password
};

try {
  const res = await fetch('http://localhost:3001/ciudadanos/registrar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  const result = await res.json();

  if (res.ok) {
    setMensaje('✅ Ciudadano registrado con éxito');
    setCi('');
    setNombre('');
    setFechaNac('');
    setCc('');
    setUsername('');
    setPassword('');
  } else {
    setMensaje(`❌ Error: ${result.message || result.error || 'No se pudo registrar'}`);
  }
} catch (error) {
  setMensaje('❌ Error inesperado al registrar ciudadano');
  console.error(error);
}
};

return (
<div className='registro-voto-container'>
<h2>Registro de Ciudadano</h2>
<form onSubmit={handleSubmit}>
<div>
<label>Cédula de Identidad:</label>
<input
type='text'
value={ci}
onChange={(e) => setCi(e.target.value)}
required
placeholder='Ej: 12345678'
/>
</div>

    <div>
      <label>Nombre completo:</label>
      <input
        type='text'
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        placeholder='Ej: Juan Pérez'
      />
    </div>

    <div>
      <label>Fecha de nacimiento:</label>
      <input
        type='date'
        value={fechaNac}
        onChange={(e) => setFechaNac(e.target.value)}
        required
      />
    </div>

    <div>
      <label>Credencial Cívica:</label>
      <input
        type='text'
        value={cc}
        onChange={(e) => setCc(e.target.value)}
        required
        placeholder='Ej: ABC12345'
      />
    </div>

    <div>
      <label>Nombre de usuario:</label>
      <input
        type='text'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        placeholder='Ej: juan123'
      />
    </div>

    <div>
      <label>Contraseña:</label>
      <input
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </div>

    <button type='submit'>Registrar</button>
  </form>

  {mensaje && <p className='mensaje'>{mensaje}</p>}
</div>
);
}

export default RegistroCiudadano;


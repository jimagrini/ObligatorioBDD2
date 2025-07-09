import React, { useState } from 'react';
import './RegistroCiudadano.css';

function RegistroCiudadano() {
  const [ci, setCi] = useState('');
  const [nombre, setNombre] = useState('');
  const [fechaNac, setFechaNac] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ci, nombre, fecha_nac: fechaNac };

    console.log('Datos que se enviarían:', data);
    setMensaje('✅ Ciudadano registrado con éxito (MODO PRUEBA)');
    setCi('');
    setNombre('');
    setFechaNac('');
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
            placeholder='Ej: juan mcgreen'
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

        <button type='submit'>Registrar</button>
      </form>

      {mensaje && <p className='mensaje'>{mensaje}</p>}
    </div>
  );
}

export default RegistroCiudadano;

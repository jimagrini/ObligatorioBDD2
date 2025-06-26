import React, { useState } from 'react';

function RegistroCiudadano() {
  const [ci, setCi] = useState('');
  const [nombre, setNombre] = useState('');
  const [fechaNac, setFechaNac] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ci, nombre, fecha_nac: fechaNac };

    // MODO PRUEBA: Simular respuesta exitosa sin backend
    console.log('Datos que se enviarían:', data);
    setMensaje('✅ Ciudadano registrado con éxito (MODO PRUEBA)');
    setCi('');
    setNombre('');
    setFechaNac('');

    /* DESCOMENTA ESTO CUANDO TENGAS EL BACKEND LISTO:
    try {
      const response = await fetch('http://localhost:3001/ciudadanos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMensaje('✅ Ciudadano registrado con éxito');
        setCi('');
        setNombre('');
        setFechaNac('');
      } else {
        const errorData = await response.json();
        setMensaje(`❌ Error: ${errorData.message || 'No se pudo registrar'}`);
      }
    } catch (error) {
      setMensaje(`❌ Error de red: ${error.message}`);
    }
    */
  };

  return (
    <div className='max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-semibold text-center mb-6'>
        Registro de Ciudadano
      </h2>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Cédula de Identidad:
          </label>
          <input
            type='text'
            value={ci}
            onChange={(e) => setCi(e.target.value)}
            required
            className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Ej: 12345678'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Nombre completo:
          </label>
          <input
            type='text'
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Ej: Juan Pérez'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Fecha de nacimiento:
          </label>
          <input
            type='date'
            value={fechaNac}
            onChange={(e) => setFechaNac(e.target.value)}
            required
            className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <button
          type='submit'
          className='bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors'
        >
          Registrar
        </button>
      </form>

      {mensaje && (
        <p className='mt-4 text-center font-medium text-green-600'>{mensaje}</p>
      )}
    </div>
  );
}

export default RegistroCiudadano;

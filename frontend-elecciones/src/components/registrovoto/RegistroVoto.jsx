import { useState, useEffect } from 'react';

export default function RegistroVoto() {
  const [ci, setCi] = useState('');
  const [idEleccion, setIdEleccion] = useState('');
  const [numeroLista, setNumeroLista] = useState('');
  const [condicion, setCondicion] = useState('válido');
  const [esObservado, setEsObservado] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const [elecciones, setElecciones] = useState([]);
  const [listas, setListas] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;

    // Obtener elecciones
    fetch('http://localhost:3001/elecciones/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setElecciones(data))
      .catch((err) => console.error('Error al cargar elecciones:', err));

    // Obtener listas
    fetch('http://localhost:3001/listas', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setListas(data))
      .catch((err) => console.error('Error al cargar listas:', err));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMensaje('❌ No estás autenticado.');
      return;
    }
    console.log({ ci, idEleccion, numeroLista, condicion, esObservado });
    const res = await fetch('http://localhost:3001/votos/registrarVoto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ci,
        id_eleccion: idEleccion,
        numero_lista: numeroLista,
        condicion,
        esObservado,
      }),
    });

    const data = await res.json();
    setMensaje(
      res.ok ? `✅ ${data.message}` : `❌ ${data.error || 'Error inesperado'}`
    );
  };

  return (
    <div className='p-4 max-w-md mx-auto'>
      <h2 className='text-xl font-bold mb-4'>Registro de Voto</h2>
      <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
        <input
          value={ci}
          onChange={(e) => setCi(e.target.value)}
          placeholder='CI del votante'
          className='border p-2'
          required
        />

        <select
          value={idEleccion}
          onChange={(e) => setIdEleccion(e.target.value)}
          className='border p-2'
          required
        >
          <option value=''>Seleccionar elección</option>
          {elecciones.map((e) => (
            <option key={e.ID_ELECCION} value={e.ID_ELECCION}>
              {e.TIPO_ELECCION} - {e.FECHA_REALIZACION}
            </option>
          ))}
        </select>

        <select
          value={numeroLista}
          onChange={(e) => setNumeroLista(e.target.value)}
          className='border p-2'
          required
        >
          <option value=''>Seleccionar lista</option>
          {listas.map((l) => (
            <option key={l.NUMERO} value={l.NUMERO}>
              Lista {l.NUMERO} - {l.NOMBRE_PARTIDO}
            </option>
          ))}
        </select>

        <input
          value={condicion}
          onChange={(e) => setCondicion(e.target.value)}
          placeholder='Condición'
          className='border p-2'
          required
        />

        <label className='flex items-center gap-2'>
          <input
            type='checkbox'
            checked={esObservado}
            onChange={() => setEsObservado(!esObservado)}
          />
          ¿Es Observado?
        </label>

        <button type='submit' className='bg-green-600 text-white p-2 rounded'>
          Registrar Voto
        </button>
      </form>

      {mensaje && <p className='mt-4'>{mensaje}</p>}
    </div>
  );
}

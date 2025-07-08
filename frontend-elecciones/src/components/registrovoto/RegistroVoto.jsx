import { useState, useEffect } from 'react';
import './RegistroVoto.css';

export default function RegistroVoto() {
const [ci, setCi] = useState('');
const [idEleccion, setIdEleccion] = useState('');
const [numeroLista, setNumeroLista] = useState('');
const [condicion, setCondicion] = useState('VALIDO');
const [esObservado, setEsObservado] = useState(false);
const [mensaje, setMensaje] = useState('');
const [elecciones, setElecciones] = useState([]);
const [listas, setListas] = useState([]);
const token = localStorage.getItem('token');

useEffect(() => {
if (!token) return;

fetch('http://localhost:3001/elecciones/', {
  headers: { Authorization: `Bearer ${token}` },
})
  .then((res) => res.json())
  .then((data) => setElecciones(data))
  .catch((err) => console.error('Error al cargar elecciones:', err));

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
<div className='registro-voto-container'>
<h2>Registro de Voto</h2>
<form onSubmit={handleSubmit}>
<input
value={ci}
onChange={(e) => setCi(e.target.value)}
placeholder='Número de voto'
required
/>
    <select
      value={idEleccion}
      onChange={(e) => setIdEleccion(e.target.value)}
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
      required
    >
      <option value=''>Seleccionar lista</option>
      {listas.map((l) => (
        <option key={l.NUMERO} value={l.NUMERO}>
          Lista {l.NUMERO} - {l.NOMBRE_PARTIDO}
        </option>
      ))}
    </select>

    <select
      value={condicion}
      onChange={(e) => setCondicion(e.target.value)}
      required
    >
      <option value='VALIDO'>VALIDO</option>
      <option value='ANULADO'>ANULADO</option>
    </select>

    <label className='checkbox-container'>
      <input
        type='checkbox'
        checked={esObservado}
        onChange={() => setEsObservado(!esObservado)}
      />
      ¿Es Observado?
    </label>

    <button type='submit'>Registrar Voto</button>
  </form>

  {mensaje && <p className='mensaje'>{mensaje}</p>}
</div>
);
}
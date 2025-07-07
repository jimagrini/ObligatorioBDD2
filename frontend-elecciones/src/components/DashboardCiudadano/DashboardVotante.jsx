import { useState, useEffect, useRef } from 'react';
import './DashboardVotante.css';

export default function DashboardVotante() {
  const [listas, setListas] = useState([]);
  const [numeroLista, setNumeroLista] = useState('');
  const [mensaje, setMensaje] = useState('');
  const mensajeRef = useRef(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:3001/listas', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setListas(data))
      .catch(() => setMensaje('❌ Error al cargar listas'));
  }, [token]);

  useEffect(() => {
    if (mensaje && mensajeRef.current) {
      mensajeRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mensaje]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3001/votos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          numero: numeroLista,
          condicion: 'valido',
          esObservado: false
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje('✅ Voto registrado correctamente');
        setNumeroLista('');
      } else {
        setMensaje(`❌ ${data.error || 'Error al registrar voto'}`);
      }
    } catch (err) {
      setMensaje('❌ Error inesperado al registrar voto');
    }
  };

  return (
    <div className="votante-dashboard">

      <h1 className="dashboard-title">Bienvenido, ciudadano!</h1>
      <h2 className="dashboard-title">Panel de Votación</h2>

      <form onSubmit={handleSubmit} className="form-voto">
        <label>Seleccione una lista:</label>
        <select
          value={numeroLista}
          onChange={e => setNumeroLista(e.target.value)}
          required
        >
          <option value="">-- Seleccione una lista --</option>
          {listas.map(l => (
            <option key={l.NUMERO} value={l.NUMERO}>
              Lista {l.NUMERO} - {l.NOMBRE_PARTIDO}
            </option>
          ))}
        </select>

        <button type="submit" className="btn btn-votar">Confirmar voto</button>
      </form>

      {mensaje && (
        <div
          ref={mensajeRef}
          className={`mensaje ${mensaje.startsWith('✅') ? 'mensaje-exito' : 'mensaje-error'}`}
        >
          {mensaje}
        </div>
      )}
    </div>
  );
}

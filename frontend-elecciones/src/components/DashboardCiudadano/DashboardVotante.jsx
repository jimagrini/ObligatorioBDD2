import { useEffect, useState, useRef } from 'react';
import Layout from '../Layout';
import './DashboardVotante.css';

export default function DashboardVotante() {
  const [elecciones, setElecciones] = useState([]);
  const [partidos, setPartidos] = useState([]);
  const [listas, setListas] = useState([]);
  const [eleccionSeleccionada, setEleccionSeleccionada] = useState('');
  const [partidoSeleccionado, setPartidoSeleccionado] = useState('');
  const [listaSeleccionada, setListaSeleccionada] = useState('');
  const [yaVoto, setYaVoto] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const mensajeRef = useRef(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;

    fetch('http://localhost:3001/elecciones', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setElecciones(data))
      .catch(() => setMensaje('❌ Error al cargar elecciones'));
  }, [token]);

  useEffect(() => {
    if (!eleccionSeleccionada) return;

    fetch(`http://localhost:3001/partidos`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setPartidos(data))
      .catch(() => setMensaje('❌ Error al cargar partidos'));
  }, [eleccionSeleccionada, token]);

  useEffect(() => {
    if (!partidoSeleccionado || !eleccionSeleccionada) return;

    fetch(`http://localhost:3001/listas`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setListas(data))
      .catch(() => setMensaje('❌ Error al cargar listas del partido'));
  }, [partidoSeleccionado, eleccionSeleccionada, token]);

  useEffect(() => {
    if (mensaje && mensajeRef.current) {
      mensajeRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mensaje]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    // Verificar si la lista seleccionada pertenece al partido seleccionado
    const listaPerteneceAlPartido = listas.some(
      (l) => l.NOMBRE_PARTIDO === partidoSeleccionado && l.NUMERO === listaSeleccionada
    );

    // Si no pertenece, marcar el voto como ANULADO
    const condicion = listaPerteneceAlPartido ? 'VALIDO' : 'ANULADO';

    try {
      const res = await fetch('http://localhost:3001/votos/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          id_eleccion: eleccionSeleccionada,
          numero_lista: listaSeleccionada || null,
          condicion: condicion,
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje('✅ Tu voto fue registrado correctamente.');
        setYaVoto(true);
      } else {
        setMensaje(`❌ ${data.error || 'Error al registrar el voto'}`);
      }
    } catch (err) {
      setMensaje('❌ Error inesperado al registrar el voto');
    }
  };

  return (
    <Layout>
      <div className="votante-dashboard">
        <h1 className="dashboard-title">Bienvenido, ciudadano 🗳</h1>
        <h2 className="dashboard-subtitle">Panel de Votación</h2>

        {yaVoto ? (
          <p className="mensaje-exito">
            ✅ Ya has votado en esta elección. Gracias por participar.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="form-voto">
            <label>1. Selecciona la elección:</label>
            <select
              value={eleccionSeleccionada}
              onChange={e => {
                setEleccionSeleccionada(e.target.value);
                setPartidoSeleccionado('');
                setListaSeleccionada('');
              }}
              required
            >
              <option value="">-- Seleccione --</option>
              {elecciones.map(e => (
                <option key={e.ID_ELECCION} value={e.ID_ELECCION}>
                  {e.TIPO_ELECCION} - {e.FECHA_REALIZACION}
                </option>
              ))}
            </select>

            {partidos.length > 0 && (
              <>
                <label>2. Selecciona el partido:</label>
                <select
                  value={partidoSeleccionado}
                  onChange={e => {
                    setPartidoSeleccionado(e.target.value);
                    setListaSeleccionada('');
                  }}
                >
                  <option value="">-- Voto en blanco --</option>
                  {partidos.map(p => (
                    <option key={p.NOMBRE} value={p.NOMBRE}>
                      {p.NOMBRE} (Presidente: {p.NOMBRE_PRESIDENTE})
                    </option>
                  ))}
                </select>
              </>
            )}

            {listas.length > 0 && partidoSeleccionado && (
              <>
                <label>3. Selecciona la lista:</label>
                <select
                  value={listaSeleccionada}
                  onChange={e => setListaSeleccionada(e.target.value)}
                >
                  <option value="">-- Voto en blanco --</option>
                  {listas.map(l => (
                    <option key={l.NUMERO} value={l.NUMERO}>
                      Lista {l.NUMERO}
                    </option>
                  ))}
                </select>
              </>
            )}

            <button type="submit" className="btn btn-votar">Emitir Voto</button>
          </form>
        )}

        {mensaje && (
          <div
            ref={mensajeRef}
            className={`mensaje ${mensaje.startsWith('✅') ? 'mensaje-exito' : 'mensaje-error'}`}
          >
            {mensaje}
          </div>
        )}
      </div>
    </Layout>
  );
}

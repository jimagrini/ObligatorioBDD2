import { useState, useEffect } from 'react';
import AdminPartidos from '../partidos/AdminPartidos';
import AdminListas from '../listas/AdminListas';
import AdminCandidatos from '../candidatos/AdminCandidatos';
import './DashboardAdmin.css';

export default function DashboardAdmin() {
  const [elecciones, setElecciones] = useState([]);
  const [circuitos, setCircuitos] = useState([]);
  const [resultadosTotales, setResultadosTotales] = useState({ total: 0, ganador: null, resultados: [] });
  const [resultadosPorCircuito, setResultadosPorCircuito] = useState({});
  const [eleccionSeleccionada, setEleccionSeleccionada] = useState(null);
  const [showListas, setShowListas] = useState(false);
  const [showPartidos, setShowPartidos] = useState(false);
  const [showCandidatos, setShowCandidatos] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:3001/elecciones', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setElecciones(data))
      .catch(err => console.error('Error al obtener elecciones:', err));
  }, [token]);

  const handleEliminarEleccion = async (id) => {
    if (!window.confirm(`¿Estás seguro que deseas eliminar la elección con ID ${id}?`)) return;
    try {
      const res = await fetch(`http://localhost:3001/elecciones/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        alert('✅ Elección eliminada correctamente');
        setElecciones(prev => prev.filter(e => e.ID_ELECCION !== id));
      } else {
        alert(`❌ Error: ${data.error || 'No se pudo eliminar la elección'}`);
      }
    } catch {
      alert('❌ Error inesperado al eliminar la elección');
    }
  };

  const handleVerCircuitos = async (idEleccion) => {
    setEleccionSeleccionada(idEleccion);
    setResultadosTotales({ total: 0, ganador: null, resultados: [] });
    setResultadosPorCircuito({});
    try {
      const res = await fetch(`http://localhost:3001/elecciones/${idEleccion}/circuitos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setCircuitos(data);
      } else {
        alert('❌ Error al obtener circuitos');
      }
    } catch {
      alert('❌ Error al cargar circuitos');
    }
  };

  const handleVerResultadosTotales = async (idEleccion) => {
    try {
      const res = await fetch(`http://localhost:3001/elecciones/${idEleccion}/resultados`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setResultadosTotales(data);
        setCircuitos([]);
        setResultadosPorCircuito({});
        setEleccionSeleccionada(idEleccion);
      } else {
        alert('❌ Error al obtener resultados');
      }
    } catch {
      alert('❌ Error al cargar resultados');
    }
  };

  const handleResultadosDelCircuito = async (idEleccion, numCircuito) => {
    try {
      const res = await fetch(`http://localhost:3001/elecciones/${idEleccion}/circuitos/${numCircuito}/votos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setResultadosPorCircuito(prev => ({ ...prev, [numCircuito]: data }));
      } else {
        alert('❌ Error al obtener resultados del circuito');
      }
    } catch {
      alert('❌ Error al cargar resultados del circuito');
    }
  };

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Dashboard Administrador</h2>
      <div className="dashboard-buttons">
        <button onClick={() => { setShowPartidos(!showPartidos); setShowListas(false); setShowCandidatos(false); }} className="btn btn-purple">
          {showPartidos ? 'Volver al Panel de Elecciones' : 'Administrar Partidos'}
        </button>
        <button onClick={() => { setShowListas(!showListas); setShowPartidos(false); setShowCandidatos(false); }} className="btn btn-indigo">
          {showListas ? 'Volver al Panel de Elecciones' : 'Administrar Listas'}
        </button>
        <button onClick={() => { setShowCandidatos(!showCandidatos); setShowListas(false); setShowPartidos(false); }} className="btn btn-teal">
          {showCandidatos ? 'Volver al Panel de Elecciones' : 'Administrar Candidatos'}
        </button>
      </div>

      {showPartidos ? <AdminPartidos /> :
        showListas ? <AdminListas /> :
          showCandidatos ? <AdminCandidatos /> : (
            <>
              <ul className="elecciones-lista">
                {elecciones.map(e => (
                  <li key={e.ID_ELECCION} className="eleccion-item">
                    <div className="eleccion-info">
                      <div>
                        <p className="eleccion-tipo">{e.TIPO_ELECCION}</p>
                        <p className="eleccion-fecha">Fecha: {e.FECHA_REALIZACION}</p>
                      </div>
                      <div className="eleccion-actions">
                        <button className="btn btn-blue" onClick={() => handleVerCircuitos(e.ID_ELECCION)}>Ver Circuitos</button>
                        <button className="btn btn-green" onClick={() => handleVerResultadosTotales(e.ID_ELECCION)}>Ver Resultados</button>
                        <button className="btn btn-red" onClick={() => handleEliminarEleccion(e.ID_ELECCION)}>Eliminar</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {eleccionSeleccionada && circuitos.length > 0 && (
                <div className="resultados-circuitos">
                  <h3>Circuitos para elección ID: {eleccionSeleccionada}</h3>
                  <ul>
                    {circuitos.map((c, i) => (
                      <li key={i} className="circuito-item">
                        <p><strong>Número:</strong> {c.NUM_CIRCUITO}</p>
                        <p><strong>Establecimiento:</strong> {c.ID} {c.DIRECCION}</p>
                        <p><strong>Departamento:</strong> {c.DEPARTAMENTO}</p>
                        <p><strong>Ciudad:</strong> {c.CIUDAD}</p>
                        <button className="btn btn-dark" onClick={() => handleResultadosDelCircuito(eleccionSeleccionada, c.NUM_CIRCUITO)}>Ver Resultados del Circuito</button>

                        {resultadosPorCircuito[c.NUM_CIRCUITO] && (
                          <div className="detalle-circuito">
                            <p><strong>✅ Válidos:</strong> {resultadosPorCircuito[c.NUM_CIRCUITO].VALIDOS || 0}</p>
                            <p><strong>❌ Anulados:</strong> {resultadosPorCircuito[c.NUM_CIRCUITO].ANULADOS || 0}</p>
                            <p><strong>👁 Observados:</strong> {resultadosPorCircuito[c.NUM_CIRCUITO].OBSERVADOS || 0}</p>
                            <p><strong>🧾 Total:</strong> {resultadosPorCircuito[c.NUM_CIRCUITO].TOTAL || 0}</p>
                            <p><strong>📦 Estado:</strong> {resultadosPorCircuito[c.NUM_CIRCUITO].CERRADO ? 'Cerrado' : 'Abierto'}</p>

                            {resultadosPorCircuito[c.NUM_CIRCUITO].GANADOR && (
                              <p><strong>🏆 Ganador:</strong> Lista {resultadosPorCircuito[c.NUM_CIRCUITO].GANADOR.NUMERO_LISTA} ({resultadosPorCircuito[c.NUM_CIRCUITO].GANADOR.NOMBRE_PARTIDO}) con {resultadosPorCircuito[c.NUM_CIRCUITO].GANADOR.PORCENTAJE}%</p>
                            )}

                            {Array.isArray(resultadosPorCircuito[c.NUM_CIRCUITO].LISTAS) && (
                              <table className="tabla-listas">
                                <thead>
                                  <tr>
                                    <th>Lista</th>
                                    <th>Partido</th>
                                    <th>Votos</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {resultadosPorCircuito[c.NUM_CIRCUITO].LISTAS.map((l, idx) => (
                                    <tr key={idx}>
                                      <td>{l.NUMERO_LISTA}</td>
                                      <td>{l.NOMBRE_PARTIDO}</td>
                                      <td>{l.VOTOS}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {eleccionSeleccionada && resultadosTotales.resultados.length > 0 && (
                <div className="resultados-totales">
                  <h3>Resultados Totales de la Elección</h3>
                  {resultadosTotales.ganador && (
                    <p className="ganador">
                      🏆 Ganador: Lista {resultadosTotales.ganador.NUMERO_LISTA} ({resultadosTotales.ganador.NOMBRE_PARTIDO}) con {resultadosTotales.ganador.PORCENTAJE}%
                    </p>
                  )}
                  <table className="tabla-listas">
                    <thead>
                      <tr>
                        <th>Lista</th>
                        <th>Partido</th>
                        <th>Votos</th>
                        <th>Porcentaje</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultadosTotales.resultados.map((r, i) => (
                        <tr key={i}>
                          <td>{r.NUMERO_LISTA}</td>
                          <td>{r.NOMBRE_PARTIDO}</td>
                          <td>{r.TOTAL_VOTOS}</td>
                          <td>{r.PORCENTAJE}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
    </div>
  );
}







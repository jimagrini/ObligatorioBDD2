import { useState, useEffect } from 'react';
import AdminPartidos from './partidos/AdminPartidos';
import AdminListas from './listas/AdminListas';
import AdminCandidatos from './candidatos/AdminCandidatos';

export default function DashboardAdmin() {
  const [elecciones, setElecciones] = useState([]);
  const [circuitos, setCircuitos] = useState([]);
  const [resultadosCircuito, setResultadosCircuito] = useState([]);
  const [resultadosTotales, setResultadosTotales] = useState([]);
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
    setResultadosTotales([]);
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
        setResultadosCircuito([]);
        setEleccionSeleccionada(idEleccion);
      } else {
        alert('❌ Error al obtener resultados');
      }
    } catch {
      alert('❌ Error al cargar resultados');
    }
  };

  const handleResultadosDelCircuito = async (idEleccion) => {
    try {
      const res = await fetch(`http://localhost:3001/elecciones/${idEleccion}/circuitos/votos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setResultadosCircuito(data);
      } else {
        alert('❌ Error al obtener resultados del circuito');
      }
    } catch {
      alert('❌ Error al cargar resultados del circuito');
    }
  };

  return (
    <div className='p-4 max-w-4xl mx-auto'>
      <h2 className='text-2xl font-bold mb-4'>Dashboard Administrador</h2>

      <div className='flex gap-2 mb-4'>
        <button
          onClick={() => {
            setShowPartidos(!showPartidos);
            setShowListas(false);
            setShowCandidatos(false);
          }}
          className='bg-purple-600 text-white px-4 py-2 rounded'
        >
          {showPartidos ? 'Volver al Panel de Elecciones' : 'Administrar Partidos'}
        </button>
        <button
          onClick={() => {
            setShowListas(!showListas);
            setShowPartidos(false);
            setShowCandidatos(false);
          }}
          className='bg-indigo-600 text-white px-4 py-2 rounded'
        >
          {showListas ? 'Volver al Panel de Elecciones' : 'Administrar Listas'}
        </button>
        <button
          onClick={() => {
            setShowCandidatos(!showCandidatos);
            setShowListas(false);
            setShowPartidos(false);
          }}
          className='bg-teal-600 text-white px-4 py-2 rounded'
        >
          {showCandidatos ? 'Volver al Panel de Elecciones' : 'Administrar Candidatos'}
        </button>
      </div>

      {showPartidos ? <AdminPartidos /> :
        showListas ? <AdminListas /> :
          showCandidatos ? <AdminCandidatos /> : (
            <>
              <ul className='space-y-3 mb-6'>
                {elecciones.map(e => (
                  <li key={e.ID_ELECCION} className='p-3 border rounded'>
                    <div className='flex justify-between items-center mb-2'>
                      <div>
                        <p className='font-semibold'>{e.TIPO_ELECCION}</p>
                        <p className='text-sm text-gray-600'>Fecha: {e.FECHA_REALIZACION}</p>
                      </div>
                      <div className='flex gap-2'>
                        <button
                          onClick={() => handleVerCircuitos(e.ID_ELECCION)}
                          className='bg-blue-600 text-white px-3 py-1 rounded'
                        >
                          Ver Circuitos
                        </button>
                        <button
                          onClick={() => handleVerResultadosTotales(e.ID_ELECCION)}
                          className='bg-green-600 text-white px-3 py-1 rounded'
                        >
                          Ver Resultados
                        </button>
                        <button
                          onClick={() => handleEliminarEleccion(e.ID_ELECCION)}
                          className='bg-red-600 text-white px-3 py-1 rounded'
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {eleccionSeleccionada && circuitos.length > 0 && (
                <div className='bg-gray-50 p-4 border rounded'>
                  <h3 className='text-lg font-bold mb-2'>Circuitos para elección ID: {eleccionSeleccionada}</h3>
                  <ul className='space-y-2'>
                    {circuitos.map((c, i) => (
                      <li key={i} className='p-2 border rounded'>
                        <p><strong>Número:</strong> {c.NUM_CIRCUITO}</p>
                        <p><strong>Establecimiento:</strong> {c.ID} {c.DIRECCION}</p>
                        <p><strong>Departamento:</strong> {c.DEPARTAMENTO}</p>
                        <p><strong>Ciudad:</strong> {c.CIUDAD}</p>
                        <button
                          onClick={() => handleResultadosDelCircuito(eleccionSeleccionada)}
                          className='mt-2 bg-gray-700 text-white px-3 py-1 rounded'
                        >
                          Ver Resultados del Circuito
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {eleccionSeleccionada && resultadosTotales.length > 0 && (
                <div className='bg-white p-4 border rounded shadow mt-6'>
                  <h3 className='text-lg font-bold mb-2'>Resultados Totales de la Elección</h3>
                  <table className='table-auto w-full border border-collapse'>
                    <thead className='bg-gray-200'>
                      <tr>
                        <th className='border px-3 py-1'>Lista</th>
                        <th className='border px-3 py-1'>Partido</th>
                        <th className='border px-3 py-1'>Votos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultadosTotales.map((r, i) => (
                        <tr key={i}>
                          <td className='border px-3 py-1 text-center'>{r.NUMERO_LISTA}</td>
                          <td className='border px-3 py-1 text-center'>{r.NOMBRE_PARTIDO}</td>
                          <td className='border px-3 py-1 text-center'>{r.TOTAL_VOTOS}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {eleccionSeleccionada && resultadosCircuito.length > 0 && (
                <div className='bg-white p-4 border rounded shadow mt-6'>
                  <h3 className='text-lg font-bold mb-2'>Resultados por Circuito</h3>
                  <table className='table-auto w-full border border-collapse'>
                    <thead className='bg-gray-200'>
                      <tr>
                        <th className='border px-3 py-1'>Circuito</th>
                        <th className='border px-3 py-1'>Válidos</th>
                        <th className='border px-3 py-1'>Anulados</th>
                        <th className='border px-3 py-1'>Observados</th>
                        <th className='border px-3 py-1'>Total</th>
                        <th className='border px-3 py-1'>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultadosCircuito.map((r, i) => (
                        <tr key={i}>
                          <td className='border px-3 py-1 text-center'>{r.NUM_CIRCUITO}</td>
                          <td className='border px-3 py-1 text-center'>{r.VALIDOS}</td>
                          <td className='border px-3 py-1 text-center'>{r.ANULADOS}</td>
                          <td className='border px-3 py-1 text-center'>{r.OBSERVADOS}</td>
                          <td className='border px-3 py-1 text-center'>{r.TOTAL}</td>
                          <td className='border px-3 py-1 text-center'>{r.CERRADO ? 'Cerrado' : 'Abierto'}</td>
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


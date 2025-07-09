import { useState, useEffect, useRef } from 'react';
import AdminPartidos from '../partidos/AdminPartidos';
import AdminListas from '../listas/AdminListas';
import AdminCandidatos from '../candidatos/AdminCandidatos';
import Layout from '../Layout';
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
const resultadosRef = useRef(null);
const circuitosRef = useRef(null);
const [mostrarFormulario, setMostrarFormulario] = useState(false);
const [nuevaEleccion, setNuevaEleccion] = useState({
id_eleccion: '',
fecha_realizacion: '',
tipo_eleccion: '',
});

const tiposValidos = [
'Elecciones Nacionales',
'Elecciones Departamentales',
'Elecciones Internas',
'Plebiscito',
'Referendum'
];
const token = localStorage.getItem('token');

useEffect(() => {
fetch('http://localhost:3001/elecciones', {
headers: { Authorization: `Bearer ${token}` }
})
.then(res => res.json())
.then(data => setElecciones(data))
.catch(err => console.error('Error al obtener elecciones:', err));
}, [token]);

useEffect(() => {
  if (resultadosTotales.resultados.length > 0 && resultadosRef.current) {
    resultadosRef.current.scrollIntoView({ behavior: 'smooth' });
  }
}, [resultadosTotales]);

useEffect(() => {
  if (circuitos.length > 0 && circuitosRef.current) {
    circuitosRef.current.scrollIntoView({ behavior: 'smooth' });
  }
}, [circuitos]);


const crearEleccion = async (e) => {
  e.preventDefault();
  try {
  const res = await fetch('http://localhost:3001/elecciones/insertarEleccion', {
  method: 'POST',
  headers: {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(nuevaEleccion),
  });
  const data = await res.json();
  if (res.ok) {
  alert('✅ Elección creada exitosamente');
  setMostrarFormulario(false);
  setNuevaEleccion({ id_eleccion: '', fecha_realizacion: '', tipo_eleccion: '' });
  setElecciones((prev) => [...prev, nuevaEleccion]);
  } else {
  alert(`❌ Error: ${data.message || 'No se pudo crear la elección'}`);
  }
  } catch (err) {
  console.error(err);
  alert('❌ Error al crear elección');
  }
  };

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
console.log('Ver circuitos para ID:', idEleccion);
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
if (circuitosRef.current) {
  circuitosRef.current.scrollIntoView({ behavior: 'smooth' });
}
} else {
alert('❌ Error al obtener circuitos');
}
} catch {
alert('❌ Error al cargar circuitos');
}
};

const handleVerResultadosTotales = async (idEleccion) => {
try {
console.log('Ver resultados para ID:', idEleccion);
const res = await fetch(`http://localhost:3001/elecciones/${idEleccion}/resultados`, {
headers: { Authorization: `Bearer ${token}` }
});
const data = await res.json();
if (res.ok) {
setResultadosTotales(data);
if (resultadosRef.current) {
  resultadosRef.current.scrollIntoView({ behavior: 'smooth' });
}
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
<Layout>
<div className="dashboard">
<h2 className="dashboard-title">Dashboard Administrador</h2>
<div className="dashboard-buttons">
<button className="btn btn-azul"onClick={() => setMostrarFormulario(true)}> ➕ Crear Elección </button>
  
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
        {/* Elecciones */}
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
          <div className="resultados-circuitos" ref={circuitosRef}> <h3>Circuitos para elección ID: {eleccionSeleccionada}</h3> <ul> {circuitos.map((c, i) => { const r = resultadosPorCircuito[c.NUM_CIRCUITO] || {}; return ( <li key={i} className="circuito-item"> <p><strong>Número:</strong> {c.NUM_CIRCUITO}</p> <p><strong>Establecimiento:</strong> {c.DIRECCION}</p> <p><strong>Departamento:</strong> {c.DEPARTAMENTO}</p> <p><strong>Ciudad:</strong> {c.CIUDAD}</p> <button className="btn btn-dark" onClick={() => handleResultadosDelCircuito(eleccionSeleccionada, c.NUM_CIRCUITO)}>Ver Resultados del Circuito</button>

                  {Object.keys(r).length > 0 && (
                    <div className="detalle-circuito">
                      <p><strong>✅ Válidos:</strong> {r.VALIDOS || 0}</p>
                      <p><strong>🗳️ Blancos:</strong> {r.BLANCO || r.BLANCOS || 0}</p>
                      <p><strong>❌ Anulados:</strong> {r.ANULADOS || 0}</p>
                      <p><strong>👁 Observados:</strong> {r.OBSERVADOS || 0}</p>
                      <p><strong>🧾 Total:</strong> {r.TOTAL || 0}</p>
                      <p><strong>📦 Estado:</strong> {r.CERRADO ? 'Cerrado' : 'Abierto'}</p>

                      {Array.isArray(r.LISTAS) && r.LISTAS.length > 0 && (
                        <table className="tabla-listas">
                          <thead>
                            <tr>
                              <th>Lista</th>
                              <th>Partido</th>
                              <th>Votos</th>
                            </tr>
                          </thead>
                          <tbody>
                            {r.LISTAS.map((l, idx) => (
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
              );
            })}
          </ul>
          </div> 
        )}

        {/* Resultados Totales */}
        {eleccionSeleccionada && resultadosTotales.resultados.length > 0 && (
          <div className="resultados-totales" ref={resultadosRef}>
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

  {mostrarFormulario && (
<div className="modal-overlay"> <div className="modal"> <h3>Nueva Elección</h3> <form onSubmit={crearEleccion} className="form-eleccion"> <input type="number" placeholder="ID de Elección" value={nuevaEleccion.id_eleccion} onChange={(e) => setNuevaEleccion({ ...nuevaEleccion, id_eleccion: e.target.value, }) } required />

    <input
      type="date"
      placeholder="Fecha de Realización"
      value={nuevaEleccion.fecha_realizacion}
      onChange={(e) =>
        setNuevaEleccion({
          ...nuevaEleccion,
          fecha_realizacion: e.target.value,
        })
      }
      required
    />

    <select
      value={nuevaEleccion.tipo_eleccion}
      onChange={(e) =>
        setNuevaEleccion({
          ...nuevaEleccion,
          tipo_eleccion: e.target.value,
        })
      }
      required
    >
      <option value="">Seleccionar tipo</option>
      {tiposValidos.map((tipo) => (
        <option key={tipo} value={tipo}>
          {tipo}
        </option>
      ))}
    </select>

    <div className="form-buttons">
      <button type="submit" className="btn btn-verde">
        Crear
      </button>
      <button
        type="button"
        className="btn btn-rojo"
        onClick={() => setMostrarFormulario(false)}
      >
        Cancelar
      </button>
    </div>
  </form>
</div>
</div> )}
</Layout>
);
}





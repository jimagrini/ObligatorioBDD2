import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout';
import './DashboardFuncionario.css';

export default function DashboardFuncionario() {
const [resumen, setResumen] = useState(null);
const [error, setError] = useState('');
const [mensaje, setMensaje] = useState('');
const token = localStorage.getItem('token');
const navigate = useNavigate();

useEffect(() => {
if (!token) return;
fetch('http://localhost:3001/funcionario/resumen', {
headers: {
Authorization: `Bearer ${token}`
}
})
.then(res => res.json())
.then(data => setResumen(data))
.catch(err => {
console.error('Error al cargar resumen:', err);
setError('Error al obtener resumen');
});
}, [token]);

const cerrarVotacion = async () => {
const res = await fetch('http://localhost:3001/funcionario/cerrar-votacion', {
method: 'POST',
headers: {
Authorization: `Bearer ${token}`
}
});
const data = await res.json();
setMensaje(data.mensaje || data.error || 'Respuesta desconocida');
};

const getCantidadPorCondicion = (condicion) => {
const match = resumen?.condiciones?.find(c => c.condicion === condicion);
return match ? match.cantidad : 0;
};

return (
<Layout>
<div className="funcionario-dashboard">
{error && <p className="error-text">{error}</p>}
{!resumen && !error && <p className="loading-text">Cargando resumen...</p>}
    {resumen && (
      <>
        <h2 className="dashboard-title">Resumen de Votos - Circuito {resumen.circuito}</h2>

        <div className="resumen-box">
          <ul>
            <li><strong>✅ Válidos:</strong> {getCantidadPorCondicion('VALIDO')}</li>
            <li><strong>❌ Anulados:</strong> {getCantidadPorCondicion('ANULADO')}</li>
            <li><strong>👁 Observados:</strong> {resumen.observados}</li>
            <li><strong>🧾 Total:</strong> {resumen.total}</li>
          </ul>
        </div>

        <h3 className="subtitulo">Distribución por Lista y Partido</h3>
        <ul className="lista-votos">
          {resumen.listas.map((l, idx) => (
            <li key={idx}>
              🗳 Lista {l.numero_lista} ({l.partido}) - {l.cantidad} votos
            </li>
          ))}
        </ul>

        <div className="botones">
          <button
            className="btn btn-verde"
            onClick={() => navigate('/registro-voto')}
          >
            Ir a Registrar Voto
          </button>
          <button
            className="btn btn-rojo"
            onClick={cerrarVotacion}
          >
            Cerrar Votación
          </button>
        </div>

        {mensaje && <p className="mensaje-final">{mensaje}</p>}
      </>
    )}
  </div>
</Layout>
);
}
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DashboardFuncionario() {
  const [resumen, setResumen] = useState(null);
  const [error, setError] = useState('');
  const [ciBuscar, setCiBuscar] = useState('');
  const [verificacion, setVerificacion] = useState('');
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
    'Authorization': `Bearer ${token}`
    }
    });

    const data = await res.json();
    alert(data.mensaje || data.error);
    };

  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!resumen) return <p className="p-4">Cargando resumen...</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Resumen de Votos - Circuito {resumen.circuito}</h2>

      <ul className="mb-4 list-disc pl-5">
        <li><strong>Total de votos:</strong> {resumen.total}</li>
        <li><strong>Observados:</strong> {resumen.observados}</li>
        {resumen.condiciones.map((c, idx) => (
          <li key={idx}>
            <strong>{c.condicion}:</strong> {c.cantidad}
          </li>
        ))}
      </ul>

      <h3 className="text-xl font-semibold mt-6 mb-2">Distribución por lista y partido</h3>
      <ul className="list-disc pl-5 mb-6">
        {resumen.listas.map((l, idx) => (
          <li key={idx}>
            Lista {l.numero_lista} ({l.partido}) - {l.cantidad} votos
          </li>
        ))}
      </ul>
      <button
        className="bg-green-700 text-white px-4 py-2 rounded"
        onClick={() => navigate('/registro-voto')}>
        Ir a Registrar Voto
      </button>
      <button className="bg-red-600 text-white px-4 py-2 rounded mt-4" onClick={cerrarVotacion}>
          Cerrar votación
      </button>
    </div>
  );
}

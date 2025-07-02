import { useEffect, useState } from 'react';
import './Resultados.css';

export default function ResultadosEleccion({ idEleccion }) {
const [resultados, setResultados] = useState([]);
const [mensaje, setMensaje] = useState('');
const token = localStorage.getItem('token');

useEffect(() => {
if (!token || !idEleccion) return;

fetch(`http://localhost:3001/resultados/${idEleccion}`, {
  headers: { Authorization: `Bearer ${token}` }
})
  .then(res => res.json())
  .then(data => setResultados(data))
  .catch(err => {
    console.error('Error al cargar resultados:', err);
    setMensaje('❌ Error al cargar resultados.');
  });
}, [idEleccion, token]);

return (
<div className="resultados-container">
<h3 className="resultados-titulo">Resultados Totales de la Elección</h3>
{mensaje && <p className="resultados-error">{mensaje}</p>}
<table className="tabla-resultados">
<thead>
<tr>
<th>Lista</th>
<th>Partido</th>
<th>Votos</th>
</tr>
</thead>
<tbody>
{resultados.map((r, idx) => (
<tr key={idx}>
<td>{r.NUMERO_LISTA}</td>
<td>{r.NOMBRE_PARTIDO}</td>
<td>{r.TOTAL_VOTOS}</td>
</tr>
))}
</tbody>
</table>
</div>
);
}

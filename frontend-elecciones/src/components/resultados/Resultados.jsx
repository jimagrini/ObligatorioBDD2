import { useEffect, useState } from 'react';

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
<div className="p-4 border rounded mt-4">
<h3 className="text-lg font-bold mb-2">Resultados Totales de la Elección</h3>
{mensaje && <p className="text-red-600">{mensaje}</p>}
<table className="w-full border mt-2">
<thead className="bg-gray-100">
<tr>
<th className="border px-2 py-1">Lista</th>
<th className="border px-2 py-1">Partido</th>
<th className="border px-2 py-1">Votos</th>
</tr>
</thead>
<tbody>
{resultados.map((r, idx) => (
<tr key={idx}>
<td className="border px-2 py-1">{r.NUMERO_LISTA}</td>
<td className="border px-2 py-1">{r.NOMBRE_PARTIDO}</td>
<td className="border px-2 py-1">{r.TOTAL_VOTOS}</td>
</tr>
))}
</tbody>
</table>
</div>
);
}


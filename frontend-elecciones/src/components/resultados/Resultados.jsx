import { useEffect, useState } from 'react';

export default function Resultados() {
const [resultados, setResultados] = useState([]);
const [mensaje, setMensaje] = useState('');

const token = localStorage.getItem('token');

useEffect(() => {
if (!token) {
setMensaje('❌ No estás autenticado.');
return;
}
fetch('http://localhost:3001/resultados', {
  headers: { Authorization: `Bearer ${token}` }
})
  .then(res => res.json())
  .then(data => setResultados(data))
  .catch(err => {
    console.error('Error al cargar resultados:', err);
    setMensaje('❌ Error al cargar resultados.');
  });
}, [token]);

// Agrupar resultados por id_eleccion
const agrupados = resultados.reduce((acc, r) => {
if (!acc[r.ID_ELECCION]) acc[r.ID_ELECCION] = [];
acc[r.ID_ELECCION].push(r);
return acc;
}, {});

return (
<div className="p-4 max-w-4xl mx-auto">
<h2 className="text-2xl font-bold mb-6">Resultados de la Elección</h2>


  {mensaje && <p className="text-red-600 mb-4">{mensaje}</p>}

  {Object.entries(agrupados).map(([idEleccion, listas]) => (
    <div key={idEleccion} className="mb-8">
      <h3 className="text-xl font-semibold mb-2">
        Elección ID:{idEleccion}
      </h3>
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2 text-left">Lista</th>
            <th className="border px-3 py-2 text-left">Partido</th>
            <th className="border px-3 py-2 text-left">Votos</th>
          </tr>
        </thead>
        <tbody>
          {listas.map((l, idx) => (
            <tr key={idx}>
              <td className="border px-3 py-1">{l.NUMERO_LISTA}</td>
              <td className="border px-3 py-1">{l.NOMBRE_PARTIDO}</td>
              <td className="border px-3 py-1">{l.TOTAL_VOTOS}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ))}
</div>
);
}
import { useEffect, useState } from 'react';

export default function AdminListas() {
const [listas, setListas] = useState([]);
const [numero, setNumero] = useState('');
const [nombrePartido, setNombrePartido] = useState('');
const [mensaje, setMensaje] = useState('');
const token = localStorage.getItem('token');

useEffect(() => {
cargarListas();
}, []);

const cargarListas = async () => {
try {
const res = await fetch('http://localhost:3001/listas', {
headers: { Authorization: `Bearer ${token}` }
});
const data = await res.json();
if (res.ok) {
setListas(data);
} else {
setMensaje('Error al cargar listas');
}
} catch (error) {
console.error(error);
setMensaje('Error al cargar listas');
}
};

const handleCrear = async (e) => {
e.preventDefault();
try {
const res = await fetch('http://localhost:3001/listas/insertarLista', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
Authorization: `Bearer ${token}`
},
body: JSON.stringify({ numero, nombre_partido: nombrePartido })
});
const data = await res.json();
if (res.ok) {
setMensaje('✅ Lista creada');
cargarListas();
setNumero('');
setNombrePartido('');
} else {
setMensaje(`❌ ${data.message || 'Error al crear'}`);
}
} catch (error) {
console.error(error);
setMensaje('Error al crear lista');
}
};

const handleEliminar = async (num) => {
const confirmar = window.confirm('¿Eliminar la lista ${num}?');
if (!confirmar) return;
try {
  const res = await fetch(`http://localhost:3001/listas/${num}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (res.ok) {
    setMensaje('✅ Lista eliminada');
    cargarListas();
  } else {
    setMensaje(`❌ ${data.error || 'Error al eliminar'}`);
  }
} catch (error) {
  console.error(error);
  setMensaje('Error al eliminar lista');
}
};

return (
<div className="border p-4 rounded bg-white shadow-md mt-4">
<h3 className="text-lg font-bold mb-2">Gestión de Listas</h3>
<form onSubmit={handleCrear} className="flex gap-2 mb-4">
<input
value={numero}
onChange={(e) => setNumero(e.target.value)}
placeholder="Número"
className="border px-2 py-1"
required
/>
<input
value={nombrePartido}
onChange={(e) => setNombrePartido(e.target.value)}
placeholder="Nombre del Partido"
className="border px-2 py-1"
required
/>
<button type="submit" className="bg-green-600 text-white px-4 py-1 rounded">
Crear Lista
</button>
</form>
  {mensaje && <p className="mb-3">{mensaje}</p>}

  <ul className="space-y-2">
    {listas.map((l) => (
      <li key={l.NUMERO} className="p-2 border rounded flex justify-between items-center">
        <span>
          Lista {l.NUMERO} - {l.NOMBRE_PARTIDO}
        </span>
        <button
          onClick={() => handleEliminar(l.NUMERO)}
          className="bg-red-600 text-white px-2 py-1 rounded"
        >
          Eliminar
        </button>
      </li>
    ))}
  </ul>
</div>
);
}
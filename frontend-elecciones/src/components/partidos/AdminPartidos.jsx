import { useState, useEffect } from 'react';

export default function AdminPartidos() {
const [partidos, setPartidos] = useState([]);
const [form, setForm] = useState({
nombre: '',
direccion: '',
ci_presidente: '',
ci_vicepresidente: ''
});
const [mensaje, setMensaje] = useState('');
const token = localStorage.getItem('token');

useEffect(() => {
fetchPartidos();
}, []);

const fetchPartidos = async () => {
try {
const res = await fetch('http://localhost:3001/partidos', {
headers: { Authorization: `Bearer ${token}` }
});
const data = await res.json();
setPartidos(data);
} catch (err) {
console.error('Error al obtener partidos:', err);
}
};

const handleChange = (e) => {
setForm({ ...form, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
e.preventDefault();
try {
const res = await fetch('http://localhost:3001/partidos', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
Authorization: `Bearer ${token}`
},
body: JSON.stringify(form)
});
const data = await res.json();
if (res.ok) {
setMensaje('✅ Partido creado');
setForm({ nombre: '', direccion: '', ci_presidente: '', ci_vicepresidente: '' });
fetchPartidos();
} else {
setMensaje(`❌ ${data.error}`);
}
} catch (err) {
setMensaje('❌ Error al crear partido');
}
};

const handleEliminar = async (nombre) => {
const confirmar = window.confirm('¿Seguro que deseas eliminar el partido ${nombre}?');
if (!confirmar) return;

try {
  const res = await fetch(`http://localhost:3001/partidos/${nombre}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (res.ok) {
    setMensaje('✅ Partido eliminado');
    fetchPartidos();
  } else {
    setMensaje(`❌ ${data.error}`);
  }
} catch (err) {
  setMensaje('❌ Error al eliminar partido');
}
};

return (
<div className="p-4 max-w-3xl mx-auto">
<h2 className="text-xl font-bold mb-4">Administrar Partidos</h2>

  <form onSubmit={handleSubmit} className="mb-6 space-y-2">
    <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="border p-2 w-full" required />
    <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Dirección" className="border p-2 w-full" required />
    <input name="ci_presidente" value={form.ci_presidente} onChange={handleChange} placeholder="CI Presidente" className="border p-2 w-full" required />
    <input name="ci_vicepresidente" value={form.ci_vicepresidente} onChange={handleChange} placeholder="CI Vicepresidente" className="border p-2 w-full" required />
    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Crear Partido</button>
  </form>

  {mensaje && <p className="mb-4">{mensaje}</p>}

  <h3 className="text-lg font-bold mb-2">Partidos Existentes</h3>
  <ul className="space-y-2">
    {partidos.map((p) => (
      <li key={p.NOMBRE} className="p-2 border rounded flex justify-between items-center">
        <div>
          <p className="font-semibold">{p.NOMBRE}</p>
          <p className="text-sm text-gray-600">Presidente: {p.CI_PRESIDENTE}, Vice: {p.CI_VICEPRESIDENTE}</p>
        </div>
        <button onClick={() => handleEliminar(p.NOMBRE)} className="bg-red-600 text-white px-3 py-1 rounded">Eliminar</button>
      </li>
    ))}
  </ul>
</div>
);
}
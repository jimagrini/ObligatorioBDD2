import { useEffect, useState } from 'react';
import './AdminListas.css';

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
const confirmar = window.confirm(`¿Eliminar la lista ${num}?`);
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
<div className="admin-listas">
<h3 className="titulo">Gestión de Listas</h3>
<form onSubmit={handleCrear} className="formulario">
<input
value={numero}
onChange={(e) => setNumero(e.target.value)}
placeholder="Número"
className="input"
required
/>
<input
value={nombrePartido}
onChange={(e) => setNombrePartido(e.target.value)}
placeholder="Nombre del Partido"
className="input"
required
/>
<button type="submit" className="btn verde">Crear Lista</button>
</form>
  {mensaje && <p className="mensaje">{mensaje}</p>}
  <h4 className="titulo">Listas existentes</h4>
  <ul className="lista-listas">
    {listas.map((l) => (
      <li key={l.NUMERO} className="lista-item">
        <span>Lista {l.NUMERO} - {l.NOMBRE_PARTIDO}</span>
        <button onClick={() => handleEliminar(l.NUMERO)} className="btn rojo">Eliminar</button>
      </li>
    ))}
  </ul>
</div>
);
}
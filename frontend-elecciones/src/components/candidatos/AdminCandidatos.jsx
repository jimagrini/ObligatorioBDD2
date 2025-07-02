import { useState, useEffect } from 'react';
import './AdminCandidatos.css';

export default function AdminCandidatos() {
const [candidatos, setCandidatos] = useState([]);
const [ci, setCi] = useState('');
const [numeroLista, setNumeroLista] = useState('');
const [organo, setOrgano] = useState('');
const [orden, setOrden] = useState('');
const token = localStorage.getItem('token');

useEffect(() => {
cargarCandidatos();
}, []);

const cargarCandidatos = () => {
fetch('http://localhost:3001/candidatos', {
headers: { Authorization: `Bearer ${token}` }
})
.then(res => res.json())
.then(data => setCandidatos(data))
.catch(err => console.error('Error al obtener candidatos:', err));
};

const handleAgregar = async (e) => {
e.preventDefault();
const res = await fetch('http://localhost:3001/candidatos/insertar', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
Authorization: `Bearer ${token}`
},
body: JSON.stringify({ ci, numero_lista: numeroLista, organo_del_estado: organo, orden_en_la_lista: orden })
});

const data = await res.json();
if (res.ok) {
  alert('✅ Candidato agregado');
  setCi('');
  setNumeroLista('');
  setOrgano('');
  setOrden('');
  cargarCandidatos();
} else {
  alert(`❌ Error: ${data.message || 'No se pudo agregar el candidato'}`);
}
};

const handleEliminar = async (ci) => {
const confirmar = window.confirm(`¿Seguro que deseas eliminar al candidato con CI ${ci}?`);
if (!confirmar) return;
const res = await fetch(`http://localhost:3001/candidatos/${ci}`, {
  method: 'DELETE',
  headers: { Authorization: `Bearer ${token}` }
});

const data = await res.json();
if (res.ok) {
  alert('✅ Candidato eliminado');
  cargarCandidatos();
} else {
  alert(`❌ Error: ${data.message || 'No se pudo eliminar el candidato'}`);
}
};

return (
<div className="admin-candidatos">
<h2 className="titulo">Administrar Candidatos</h2>
  <form onSubmit={handleAgregar} className="formulario">
    <input value={ci} onChange={e => setCi(e.target.value)} placeholder="CI" className="input" required />
    <input value={numeroLista} onChange={e => setNumeroLista(e.target.value)} placeholder="Número de Lista" className="input" required />
    <input value={organo} onChange={e => setOrgano(e.target.value)} placeholder="Órgano del Estado" className="input" required />
    <input value={orden} onChange={e => setOrden(e.target.value)} placeholder="Orden en la Lista" className="input" required />
    <button type="submit" className="btn verde">Agregar Candidato</button>
  </form>

  <table className="tabla">
    <thead>
      <tr>
        <th>CI</th>
        <th>Lista</th>
        <th>Órgano</th>
        <th>Orden</th>
        <th>Acción</th>
      </tr>
    </thead>
    <tbody>
      {candidatos.map((c, i) => (
        <tr key={i}>
          <td>{c.CI}</td>
          <td>{c.NUMERO_LISTA}</td>
          <td>{c.ORGANO_DEL_ESTADO}</td>
          <td>{c.ORDEN_EN_LA_LISTA}</td>
          <td>
            <button onClick={() => handleEliminar(c.CI)} className="btn rojo">Eliminar</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
);
}
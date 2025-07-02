import { useState, useEffect } from 'react';
import './AdminPartidos.css';

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
    const confirmar = window.confirm(`¿Seguro que deseas eliminar el partido ${nombre}?`);
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
    <div className="admin-partidos">
      <h2 className="titulo">Administrar Partidos</h2>

      <form onSubmit={handleSubmit} className="formulario">
        <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required />
        <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Dirección" required />
        <input name="ci_presidente" value={form.ci_presidente} onChange={handleChange} placeholder="CI Presidente" required />
        <input name="ci_vicepresidente" value={form.ci_vicepresidente} onChange={handleChange} placeholder="CI Vicepresidente" required />
        <button type="submit" className="btn verde">Crear Partido</button>
      </form>

      {mensaje && <p className="mensaje">{mensaje}</p>}

      <h3 className="subtitulo">Partidos Existentes</h3>
      <ul className="lista-partidos">
        {partidos.map((p) => (
          <li key={p.NOMBRE} className="partido-item">
            <div className="partido-info">
              <p className="nombre">{p.NOMBRE}</p>
              <p className="detalle">Presidente: {p.CI_PRESIDENTE}, Vice: {p.CI_VICEPRESIDENTE}</p>
            </div>
            <button onClick={() => handleEliminar(p.NOMBRE)} className="btn rojo">Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { useState, useEffect } from 'react';

export default function AdminCandidatos() {
  const [candidatos, setCandidatos] = useState([]);
  const [ci, setCi] = useState('');
  const [numeroLista, setNumeroLista] = useState('');
  const [organo, setOrgano] = useState('');
  const [orden, setOrden] = useState('');
  const token = localStorage.getItem('token');

  const cargarCandidatos = () => {
    fetch('http://localhost:3001/candidatos', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setCandidatos(data))
      .catch(err => console.error('Error al obtener candidatos:', err));
  };

  useEffect(() => {
    cargarCandidatos();
  }, []);

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
    <div className='p-4 max-w-xl mx-auto'>
      <h2 className='text-xl font-bold mb-4'>Administrar Candidatos</h2>

      <form onSubmit={handleAgregar} className='space-y-2 mb-4'>
        <input value={ci} onChange={e => setCi(e.target.value)} placeholder='CI' className='w-full p-2 border' required />
        <input value={numeroLista} onChange={e => setNumeroLista(e.target.value)} placeholder='Número de Lista' className='w-full p-2 border' required />
        <input value={organo} onChange={e => setOrgano(e.target.value)} placeholder='Órgano del Estado' className='w-full p-2 border' required />
        <input value={orden} onChange={e => setOrden(e.target.value)} placeholder='Orden en la Lista' className='w-full p-2 border' required />
        <button type='submit' className='bg-green-600 text-white px-4 py-2 rounded'>Agregar Candidato</button>
      </form>

      <table className='w-full border border-collapse'>
        <thead className='bg-gray-200'>
          <tr>
            <th className='border px-2'>CI</th>
            <th className='border px-2'>Lista</th>
            <th className='border px-2'>Órgano</th>
            <th className='border px-2'>Orden</th>
            <th className='border px-2'>Acción</th>
          </tr>
        </thead>
        <tbody>
          {candidatos.map((c, i) => (
            <tr key={i}>
              <td className='border px-2 text-center'>{c.CI}</td>
              <td className='border px-2 text-center'>{c.NUMERO_LISTA}</td>
              <td className='border px-2 text-center'>{c.ORGANO_DEL_ESTADO}</td>
              <td className='border px-2 text-center'>{c.ORDEN_EN_LA_LISTA}</td>
              <td className='border px-2 text-center'>
                <button onClick={() => handleEliminar(c.CI)} className='bg-red-600 text-white px-2 py-1 rounded'>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

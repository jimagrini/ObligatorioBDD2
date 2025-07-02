import { useNavigate } from 'react-router-dom';
import './Layout.css';
import {jwtDecode} from 'jwt-decode';

export default function Layout({ children }) {
const navigate = useNavigate();
const token = localStorage.getItem('token');

let username = 'Usuario';
let rol = '';

try {
if (token) {
const decoded = jwtDecode(token);
if (decoded.username) username = decoded.username;
if (decoded.rol) rol = decoded.rol;
}
} catch (e) {
console.error('Token inválido:', e);
}

const logout = () => {
localStorage.clear();
navigate('/');
};

return (
<div className="layout">
<header className="layout-header">
<h1 className="logo" onClick={() => navigate('/')}>🗳 Sistema Electoral</h1>
<div className="user-info">
<span className="username">👤 {username} <span className="rol">({rol})</span></span>
<button onClick={logout} className="logout-btn">Cerrar Sesión</button>
</div>
</header>
<main className="layout-content">
{children}
</main>
</div>
);
}
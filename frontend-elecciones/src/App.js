import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Login from './components/Login/Login';
import DashboardVotante from './components/DashboardCiudadano/DashboardVotante';
import DashboardFuncionario from './components/DashboardFuncionario/DashboardFuncionario';
import DashboardAdmin from './components/DashboardAdmin/DashboardAdmin';
import RegistroVoto from './components/registrovoto/RegistroVoto';
import RegistroCiudadano from './components/registrociudadano/RegistroCiudadano';
import Resultados from './components/resultados/Resultados';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/votante' element={<DashboardVotante />} />
        <Route path='/funcionario' element={<DashboardFuncionario />} />
        <Route path='/admin' element={<DashboardAdmin />} />
        <Route path='/registro-voto' element={<RegistroVoto />} />
        <Route path='/registro-ciudadano' element={<RegistroCiudadano />} />
        <Route path='/resultados' element={<Resultados />} />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </Router>
  );
}

export default App;

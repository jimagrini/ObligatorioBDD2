import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import DashboardVotante from './components/DashboardVotante';
import DashboardFuncionario from './components/DashboardFuncionario';
import DashboardAdmin from './components/DashboardAdmin';
import RegisroVoto from './components/RegistroVoto';
import Resultados from './components/Resultados';





function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/votante" element={<DashboardVotante />} />
        <Route path="/funcionario" element={<DashboardFuncionario />} />
        <Route path="/admin" element={<DashboardAdmin />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/registro-voto" element={<RegisroVoto />} />
        <Route path="/resultados" element={<Resultados />} />
      </Routes>
    </Router>
  );
}

export default App;

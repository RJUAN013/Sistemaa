import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme'; // Importar o tema
import Login from './components/Login/Login';
import Menu from './components/Menu/Menu';
import CadastroPaciente from './components/CadastroPaciente/CadastroPaciente';
import Anamnese from './components/Anamnese/Anamnese';
import ConsultaPaciente from './components/ConsultaPaciente/ConsultaPaciente';
import Agendamento from './components/Agendamento/Agendamento';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cadastro-paciente" element={<CadastroPaciente />} />
          <Route path="/anamnese" element={<Anamnese />} />
          <Route path="/consulta-paciente" element={<ConsultaPaciente />} />
          <Route path="/agendamento" element={<Agendamento />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;

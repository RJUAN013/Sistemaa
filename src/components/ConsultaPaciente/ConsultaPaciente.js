import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ConsultaContainer, 
  ConsultaTitle, 
  ConsultaForm, 
  ConsultaLabel, 
  ConsultaInput, 
  ConsultaButton 
} from './ConsultaPaciente.styles';

const ConsultaPaciente = () => {
  const [pacientes] = useState([
    {
      id: 1,
      nome: 'Luiz Inácio Lula da Silva',
      dataNascimento: '1945-10-27',
      cpf: '000.000.000-02',
      rg: '987654321',
      cartaoSus: '0987654321',
      sexo: 'Masculino',
      cor: 'Pardo',
      endereco: 'São Bernardo do Campo, SP',
      telefone: '88888-8888',
      profissao: 'Político',
      isFalecido: false,
    },
    // Adicione mais pacientes aqui, se necessário
  ]);
  const [nomeBusca, setNomeBusca] = useState('');
  const [cpfBusca, setCpfBusca] = useState('');
  const [pacienteEncontrado, setPacienteEncontrado] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  const handleBuscar = () => {
    const paciente = pacientes.find(p =>
      (nomeBusca === '' || p.nome.toLowerCase().includes(nomeBusca.toLowerCase())) &&
      (cpfBusca === '' || p.cpf.includes(cpfBusca))
    );
    if (paciente) {
      setPacienteEncontrado(paciente);
      setMensagem('');
    } else {
      setPacienteEncontrado(null);
      setMensagem('Não possui cadastro');
    }
  };

  const handleAlterar = () => {
    navigate('/cadastro-paciente', { state: { paciente: pacienteEncontrado } });
  };

  const handleCadastrar = () => {
    navigate('/cadastro-paciente');
  };

  return (
    <ConsultaContainer>
      <ConsultaTitle>Consulta de Paciente</ConsultaTitle>
      <ConsultaForm>
        <ConsultaLabel>
          Nome:
          <ConsultaInput
            type="text"
            value={nomeBusca}
            onChange={(e) => setNomeBusca(e.target.value)}
            placeholder="Buscar por nome"
          />
        </ConsultaLabel>
        <ConsultaLabel>
          CPF:
          <ConsultaInput
            type="text"
            value={cpfBusca}
            onChange={(e) => setCpfBusca(e.target.value)}
            placeholder="Buscar por CPF"
          />
        </ConsultaLabel>
        <ConsultaButton type="button" onClick={handleBuscar}>Buscar</ConsultaButton>
      </ConsultaForm>
      {pacienteEncontrado ? (
        <div>
          <p>Nome: {pacienteEncontrado.nome}</p>
          <p>Data de Nascimento: {pacienteEncontrado.dataNascimento}</p>
          <p>CPF: {pacienteEncontrado.cpf}</p>
          <p>RG: {pacienteEncontrado.rg}</p>
          <p>Cartão SUS: {pacienteEncontrado.cartaoSus}</p>
          <p>Sexo: {pacienteEncontrado.sexo}</p>
          <p>Cor: {pacienteEncontrado.cor}</p>
          <p>Endereço: {pacienteEncontrado.endereco}</p>
          <p>Telefone: {pacienteEncontrado.telefone}</p>
          <p>Profissão: {pacienteEncontrado.profissao}</p>
          <p>Falecido: {pacienteEncontrado.isFalecido ? 'Sim' : 'Não'}</p>
          <ConsultaButton type="button" onClick={handleAlterar}>Alterar</ConsultaButton>
        </div>
      ) : (
        <div>
          <p>{mensagem}</p>
          {mensagem && <ConsultaButton type="button" onClick={handleCadastrar}>Cadastrar</ConsultaButton>}
        </div>
      )}
    </ConsultaContainer>
  );
};

export default ConsultaPaciente;

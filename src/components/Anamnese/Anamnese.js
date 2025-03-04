import React, { useState } from 'react';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import database from '../../firebaseConfig';
import { 
  AnamneseContainer, 
  AnamneseTitle, 
  AnamneseForm, 
  AnamneseLabel, 
  AnamneseInput, 
  AnamneseTextarea, 
  AnamneseButton, 
  AnamnesePatientDetails 
} from './Anamnese.styles';

const Anamnese = () => {
  const [paciente, setPaciente] = useState(null);
  const [responsavel, setResponsavel] = useState('');
  const [descricao, setDescricao] = useState('');
  const [buscaCpf, setBuscaCpf] = useState('');
  const [buscaCartaoSus, setBuscaCartaoSus] = useState('');
  const [buscaRg, setBuscaRg] = useState('');

  const buscarPaciente = () => {
    const pacienteRef = ref(database, 'pacientes');
    let q;

    if (buscaCpf) {
      q = query(pacienteRef, orderByChild('cpf'), equalTo(buscaCpf));
    } else if (buscaCartaoSus) {
      q = query(pacienteRef, orderByChild('cartaoSus'), equalTo(buscaCartaoSus));
    } else if (buscaRg) {
      q = query(pacienteRef, orderByChild('rg'), equalTo(buscaRg));
    }

    if (q) {
      get(q).then((snapshot) => {
        if (snapshot.exists()) {
          const pacienteData = [];
          snapshot.forEach((childSnapshot) => {
            pacienteData.push({ id: childSnapshot.key, ...childSnapshot.val() });
          });
          if (pacienteData.length === 1) {
            setPaciente(pacienteData[0]);
          } else {
            setPaciente(null);
            alert('Paciente não encontrado ou múltiplos resultados encontrados');
          }
        } else {
          setPaciente(null);
          alert('Paciente não encontrado');
        }
      }).catch((error) => {
        console.error('Erro ao buscar paciente:', error);
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!paciente) {
      alert('Por favor, busque e selecione um paciente primeiro.');
      return;
    }
    const anamneseData = {
      pacienteId: paciente.id,
      responsavel,
      descricao,
    };
    console.log('Anamnese salva:', anamneseData);
    alert('Anamnese salva com sucesso!');
  };

  return (
    <AnamneseContainer>
      <AnamneseTitle>Anamnese</AnamneseTitle>
      <AnamneseForm onSubmit={handleSubmit}>
        <AnamneseLabel>
          Buscar por CPF:
          <AnamneseInput
            type="text"
            value={buscaCpf}
            onChange={(e) => setBuscaCpf(e.target.value)}
          />
        </AnamneseLabel>
        <AnamneseLabel>
          Buscar por Cartão SUS:
          <AnamneseInput
            type="text"
            value={buscaCartaoSus}
            onChange={(e) => setBuscaCartaoSus(e.target.value)}
          />
        </AnamneseLabel>
        <AnamneseLabel>
          Buscar por RG:
          <AnamneseInput
            type="text"
            value={buscaRg}
            onChange={(e) => setBuscaRg(e.target.value)}
          />
        </AnamneseLabel>
        <AnamneseButton type="button" onClick={buscarPaciente}>Buscar Paciente</AnamneseButton>
        {paciente && (
          <>
            <AnamnesePatientDetails>
              <p>Nome: {paciente.nomeCompleto}</p>
              <p>Data de Nascimento: {paciente.dataNascimento}</p>
              <p>CPF: {paciente.cpf}</p>
              <p>RG: {paciente.rg}</p>
              <p>Cartão SUS: {paciente.cartaoSus}</p>
              <p>Sexo: {paciente.sexo}</p>
              <p>Cor: {paciente.cor}</p>
              <p>Endereço: {paciente.logradouro}</p>
              <p>Telefone: {paciente.telefone}</p>
              <p>Profissão: {paciente.profissao}</p>
              <p>Falecido: {paciente.isFalecido ? "Sim" : "Não"}</p>
            </AnamnesePatientDetails>
            <AnamneseLabel>
              Responsável:
              <AnamneseInput 
                type="text" 
                value={responsavel} 
                onChange={(e) => setResponsavel(e.target.value)} 
                required={paciente.idade < 18}
                disabled={paciente.idade >= 18}
              />
            </AnamneseLabel>
            <AnamneseLabel>
              Descrição:
              <AnamneseTextarea value={descricao} onChange={(e) => setDescricao(e.target.value)} />
            </AnamneseLabel>
          </>
        )}
        <AnamneseButton type="submit">Salvar</AnamneseButton>
      </AnamneseForm>
    </AnamneseContainer>
  );
};

export default Anamnese;

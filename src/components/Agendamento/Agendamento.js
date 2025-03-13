import React, { useState } from 'react';

const Agendamento = () => {
  const [clientes] = useState([
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
    // Adicione mais clientes aqui, se necessário
  ]);
  const [clienteSelecionado, setClienteSelecionado] = useState('');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const agendamento = {
      clienteId: clienteSelecionado,
      data,
      horario,
    };
    console.log('Agendamento:', agendamento);
    alert('Agendamento realizado com sucesso!');
  };

  return (
    <div>
      <h2>Agendamento</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Cliente:
          <select value={clienteSelecionado} onChange={(e) => setClienteSelecionado(e.target.value)}>
            <option value="">Selecione um cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </option>
            ))}
          </select>
        </label>
        <label>
          Data:
          <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
        </label>
        <label>
          Horário:
          <input type="time" value={horario} onChange={(e) => setHorario(e.target.value)} />
        </label>
        <button type="submit">Agendar</button>
      </form>
    </div>
  );
};

export default Agendamento;

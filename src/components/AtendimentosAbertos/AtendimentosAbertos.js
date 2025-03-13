import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ref, get, update } from 'firebase/database';
import { TextField, Button, Typography } from '@mui/material';
import database from '../../firebaseConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  AtendimentosContainer,
  AtendimentoItem,
  AtendimentoButton,
} from './AtendimentosAbertos.styles';

const AtendimentosAbertos = () => {
  const [atendimentos, setAtendimentos] = useState([]);
  const [selectedAtendimento, setSelectedAtendimento] = useState(null);
  const { control, handleSubmit } = useForm();

  useEffect(() => {
    fetchAtendimentosAbertos();
  }, []);

  const fetchAtendimentosAbertos = async () => {
    try {
      const atendimentosRef = ref(database, 'anamneses');
      const snapshot = await get(atendimentosRef);
      if (snapshot.exists()) {
        const anamneses = snapshot.val();
        const atendimentosAbertos = Object.entries(anamneses).flatMap(([patientId, anamneses]) =>
          Object.entries(anamneses).map(([anamneseId, anamnese]) => ({
            ...anamnese,
            patientId,
            anamneseId,
          }))
        ).filter(anamnese => anamnese.status === 'aberto');
        setAtendimentos(atendimentosAbertos);
      }
    } catch (error) {
      toast.error('Erro ao buscar atendimentos em aberto: ' + error.message);
    }
  };

  const handleFinalizeAtendimento = async (data) => {
    if (!selectedAtendimento) {
      toast.error('Nenhum atendimento selecionado para finalizar');
      return;
    }

    try {
      const anamneseRef = ref(database, `anamneses/${selectedAtendimento.patientId}/${selectedAtendimento.anamneseId}`);
      await update(anamneseRef, {
        status: 'fechado',
        observacoesMedico: data.observacoesMedico,
      });
      fetchAtendimentosAbertos();
      toast.success('Atendimento finalizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao finalizar o atendimento: ' + error.message);
    }
  };

  return (
    <AtendimentosContainer>
      <Typography variant="h4">Atendimentos em Aberto</Typography>
      {atendimentos.map((atendimento, index) => (
        <AtendimentoItem key={index}>
          <Typography variant="h6">Paciente: {atendimento.patientId}</Typography>
          <Typography>Sintomas: {atendimento.sintomas}</Typography>
          <Typography>Motivo da Consulta: {atendimento.motivoConsulta}</Typography>
          <Typography>Status: {atendimento.status}</Typography>
          <AtendimentoButton onClick={() => setSelectedAtendimento(atendimento)}>
            Selecionar
          </AtendimentoButton>
        </AtendimentoItem>
      ))}

      {selectedAtendimento && (
        <form onSubmit={handleSubmit(handleFinalizeAtendimento)}>
          <Typography variant="h6">Finalizar Atendimento</Typography>
          <Controller
            name="observacoesMedico"
            control={control}
            defaultValue=""
            render={({ field }) => <TextField {...field} label="Observações do Médico" fullWidth />}
          />
          <AtendimentoButton type="submit">Finalizar Atendimento</AtendimentoButton>
        </form>
      )}

      <ToastContainer />
    </AtendimentosContainer>
  );
};

export default AtendimentosAbertos;

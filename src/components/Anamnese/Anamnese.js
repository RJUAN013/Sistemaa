import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ref, get, update, push } from 'firebase/database';
import { TextField, Button, Typography } from '@mui/material';
import database from '../../firebaseConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ControlledDate from '../ControlledDate';
import ControlledInput from '../ControlledInput';
import {
  AnamneseContainer,
  AnamneseTitle,
  AnamneseSection,
  AnamneseButton,
  SearchSection,
  SearchButton,
  PrintContainer,
} from './Anamnese.styles';

const Anamnese = () => {
  const { control, handleSubmit, setValue, getValues } = useForm();
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const printRef = useRef();

  const fetchPatientData = async (cpf) => {
    try {
      setLoading(true);
      const patientRef = ref(database, 'pacientes');
      const snapshot = await get(patientRef);
      if (snapshot.exists()) {
        const patients = snapshot.val();
        const patient = Object.values(patients).find(p => p.cpf === cpf);
        if (patient) {
          setPatientData(patient);
          // Carregar os dados no formulário
          setValue('nome', patient.nome);
          setValue('dataNascimento', patient.dataNascimento);
          setValue('sexo', patient.sexo);
          setValue('cor', patient.cor);
          setValue('nomeResponsavel', patient.responsavel?.nome);
          setValue('parentescoResponsavel', patient.responsavel?.parentesco);
          setValue('altura', patient.altura);
          setValue('peso', patient.peso);
          setValue('tipoSanguineo', patient.tipoSanguineo);
          setValue('alergias', patient.alergias);
          setValue('doencasCronicas', patient.doencasCronicas);
          setValue('usoDeMedicamentos', patient.usoDeMedicamentos);
          setValue('cirurgiasAnteriores', patient.cirurgiasAnteriores);
          setValue('historicoFamiliarDeDoencas', patient.historicoFamiliarDeDoencas);
          setValue('habitosDeVida', patient.habitosDeVida);
          toast.success('Paciente encontrado!');
        } else {
          toast.error('Paciente não encontrado');
          setPatientData(null);
        }
      } else {
        toast.error('Nenhum paciente encontrado no banco de dados');
      }
    } catch (error) {
      toast.error('Erro ao buscar dados do paciente: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!patientData) {
      toast.error('Busque um paciente primeiro');
      return;
    }

    try {
      // Salvar a anamnese única para o paciente no banco de dados
      const anamneseRef = ref(database, `anamneses/${patientData.id}`);
      const newAnamneseRef = push(anamneseRef);
      await update(newAnamneseRef, {
        sintomas: data.sintomas,
        motivoConsulta: data.motivoConsulta,
        observacoes: data.observacoes,
        exames: data.exames, // Adiciona o campo para anexar exames
        status: 'aberto',
        altura: data.altura,
        peso: data.peso,
        tipoSanguineo: data.tipoSanguineo,
        alergias: data.alergias,
        doencasCronicas: data.doencasCronicas,
        usoDeMedicamentos: data.usoDeMedicamentos,
        cirurgiasAnteriores: data.cirurgiasAnteriores,
        historicoFamiliarDeDoencas: data.historicoFamiliarDeDoencas,
        habitosDeVida: data.habitosDeVida,
      });

      toast.success('Atendimento iniciado com sucesso!');
    } catch (error) {
      toast.error('Erro ao iniciar o atendimento: ' + error.message);
    }
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const printWindow = window.open('', '', 'width=800,height=600');
      printWindow.document.write('<html><head><title>Imprimir Anamnese</title></head><body>');
      printWindow.document.write(printContent);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    } else {
      toast.error('Erro ao imprimir: conteúdo não encontrado');
    }
  };

  return (
    <AnamneseContainer>
      <AnamneseTitle>Anamnese</AnamneseTitle>
      
      {/* Campo para buscar paciente pelo CPF */}
      <SearchSection>
        <ControlledInput
          name="cpf"
          control={control}
          label="CPF"
          inputType="cpf"
          rules={{ required: "CPF é obrigatório" }}
        />
        <SearchButton
          type="button"
          onClick={() => fetchPatientData(getValues('cpf'))}
          disabled={loading}
        >
          {loading ? 'Buscando...' : 'Buscar Paciente'}
        </SearchButton>
      </SearchSection>

      {patientData && (
        <PrintContainer ref={printRef}>
          {/* Dados Pessoais */}
          <AnamneseSection>
            <Typography variant="h6">Dados Pessoais</Typography>
            <ControlledInput name="nome" control={control} label="Nome Completo" inputType="text" disabled />
            <ControlledDate name="dataNascimento" control={control} label="Data de Nascimento" disabled />
            <ControlledInput name="sexo" control={control} label="Sexo" inputType="text" disabled />
            <ControlledInput name="cor" control={control} label="Cor" inputType="text" disabled />
            {/* Adicione outros campos pessoais conforme necessário */}
          </AnamneseSection>
          
          {/* Informações do Responsável */}
          {patientData.responsavel && (
            <AnamneseSection>
              <Typography variant="h6">Informações do Responsável</Typography>
              <ControlledInput name="nomeResponsavel" control={control} label="Nome do Responsável" inputType="text" disabled />
              <ControlledInput name="parentescoResponsavel" control={control} label="Parentesco" inputType="text" disabled />
              {/* Adicione outros campos do responsável conforme necessário */}
            </AnamneseSection>
          )}
          
          {/* Dados Físicos */}
          <AnamneseSection>
            <Typography variant="h6">Dados Físicos</Typography>
            <ControlledInput
              name="altura"
              control={control}
              label="Altura"
              inputType="decimal"
            />
            <ControlledInput
              name="peso"
              control={control}
              label="Peso"
              inputType="decimal"
            />
            <ControlledInput
              name="tipoSanguineo"
              control={control}
              label="Tipo Sanguíneo"
              inputType="text"
            />
          </AnamneseSection>
          
          {/* Histórico de Saúde */}
          <AnamneseSection>
            <Typography variant="h6">Histórico de Saúde</Typography>
            <ControlledInput
              name="alergias"
              control={control}
              label="Alergias"
              inputType="text"
            />
            <ControlledInput
              name="doencasCronicas"
              control={control}
              label="Doenças Crônicas"
              inputType="text"
            />
            <ControlledInput
              name="usoDeMedicamentos"
              control={control}
              label="Uso de Medicamentos"
              inputType="text"
            />
            <ControlledInput
              name="cirurgiasAnteriores"
              control={control}
              label="Cirurgias Anteriores"
              inputType="text"
            />
            <ControlledInput
              name="historicoFamiliarDeDoencas"
              control={control}
              label="Histórico Familiar de Doenças"
              inputType="text"
            />
            <ControlledInput
              name="habitosDeVida"
              control={control}
              label="Hábitos de Vida"
              inputType="text"
            />
            {/* Adicione outros campos de histórico de saúde conforme necessário */}
          </AnamneseSection>

          {/* Informações Atuais do Paciente */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnamneseSection>
              <Typography variant="h6">Informações Atuais do Paciente</Typography>
              <ControlledInput
                name="sintomas"
                control={control}
                label="Sintomas"
                inputType="file"
                
              />
              <ControlledInput
                name="motivoConsulta"
                control={control}
                label="Motivo da Consulta"
                inputType="file"
                
              />
              <ControlledInput
                name="observacoes"
                control={control}
                label="Observações"
                inputType="file"
                
              />
              <ControlledInput
                name="exames"
                control={control}
                label="Anexar Exames"
                inputType="file"
              />
              {/* Adicione outros campos para informações atuais conforme necessário */}
            </AnamneseSection>
            <AnamneseButton type="submit">Iniciar Atendimento</AnamneseButton>
          </form>
        </PrintContainer>
      )}

      <Button variant="contained" color="primary" onClick={handlePrint}>
        Imprimir Anamnese
      </Button>

      <ToastContainer />
    </AnamneseContainer>
  );
};

export default Anamnese;

import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ref, get, update } from 'firebase/database';
import { TextField, Button, Typography } from '@mui/material';
import database from '../../firebaseConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import ReactToPrint from 'react-to-print'; // Não necessário com a abordagem customizada
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
      // Atualizar os dados no cadastro do paciente
      const patientRef = ref(database, `pacientes/${patientData.id}`);
      await update(patientRef, {
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

      // Salvar as informações atuais do paciente na anamnese
      const anamneseRef = ref(database, `anamneses/${patientData.id}`);
      await update(anamneseRef, {
        sintomas: data.sintomas,
        motivoConsulta: data.motivoConsulta,
        observacoes: data.observacoes,
      });

      toast.success('Dados atualizados com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar dados: ' + error.message);
    }
  };

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write('<html><head><title>Imprimir Anamnese</title></head><body>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <AnamneseContainer>
      <AnamneseTitle>Anamnese</AnamneseTitle>
      
      {/* Campo para buscar paciente pelo CPF */}
      <SearchSection>
        <Controller
          name="cpf"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} label="CPF" fullWidth />}
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
            <TextField label="Nome Completo" value={patientData.nome} fullWidth disabled />
            <TextField label="Data de Nascimento" value={patientData.dataNascimento} fullWidth disabled />
            <TextField label="Sexo" value={patientData.sexo} fullWidth disabled />
            <TextField label="Cor" value={patientData.cor} fullWidth disabled />
            {/* Adicione outros campos pessoais conforme necessário */}
          </AnamneseSection>
          
          {/* Informações do Responsável */}
          {patientData.responsavel && (
            <AnamneseSection>
              <Typography variant="h6">Informações do Responsável</Typography>
              <TextField label="Nome do Responsável" value={patientData.responsavel.nome} fullWidth disabled />
              <TextField label="Parentesco" value={patientData.responsavel.parentesco} fullWidth disabled />
              {/* Adicione outros campos do responsável conforme necessário */}
            </AnamneseSection>
          )}
          
          {/* Dados Físicos */}
          <AnamneseSection>
            <Typography variant="h6">Dados Físicos</Typography>
            <Controller
              name="altura"
              control={control}
              defaultValue={patientData.altura}
              render={({ field }) => <TextField {...field} label="Altura" fullWidth />}
            />
            <Controller
              name="peso"
              control={control}
              defaultValue={patientData.peso}
              render={({ field }) => <TextField {...field} label="Peso" fullWidth />}
            />
            <Controller
              name="tipoSanguineo"
              control={control}
              defaultValue={patientData.tipoSanguineo}
              render={({ field }) => <TextField {...field} label="Tipo Sanguíneo" fullWidth />}
            />
            {/* Adicione outros dados físicos conforme necessário */}
          </AnamneseSection>
          
          {/* Histórico de Saúde */}
          <AnamneseSection>
            <Typography variant="h6">Histórico de Saúde</Typography>
            <Controller
              name="alergias"
              control={control}
              defaultValue={patientData.alergias}
              render={({ field }) => <TextField {...field} label="Alergias" fullWidth />}
            />
            <Controller
              name="doencasCronicas"
              control={control}
              defaultValue={patientData.doencasCronicas}
              render={({ field }) => <TextField {...field} label="Doenças Crônicas" fullWidth />}
            />
            <Controller
              name="usoDeMedicamentos"
              control={control}
              defaultValue={patientData.usoDeMedicamentos}
              render={({ field }) => <TextField {...field} label="Uso de Medicamentos" fullWidth />}
            />
            <Controller
              name="cirurgiasAnteriores"
              control={control}
              defaultValue={patientData.cirurgiasAnteriores}
              render={({ field }) => <TextField {...field} label="Cirurgias Anteriores" fullWidth />}
            />
            <Controller
              name="historicoFamiliarDeDoencas"
              control={control}
              defaultValue={patientData.historicoFamiliarDeDoencas}
              render={({ field }) => <TextField {...field} label="Histórico Familiar de Doenças" fullWidth />}
            />
                        <Controller
              name="habitosDeVida"
              control={control}
              defaultValue={patientData.habitosDeVida}
              render={({ field }) => <TextField {...field} label="Hábitos de Vida" fullWidth />}
            />
            {/* Adicione outros campos de histórico de saúde conforme necessário */}
          </AnamneseSection>

          {/* Informações Atuais do Paciente */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnamneseSection>
              <Typography variant="h6">Informações Atuais do Paciente</Typography>
              <Controller
                name="sintomas"
                control={control}
                defaultValue=""
                render={({ field }) => <TextField {...field} label="Sintomas" fullWidth />}
              />
              <Controller
                name="motivoConsulta"
                control={control}
                defaultValue=""
                render={({ field }) => <TextField {...field} label="Motivo da Consulta" fullWidth />}
              />
              <Controller
                name="observacoes"
                control={control}
                defaultValue=""
                render={({ field }) => <TextField {...field} label="Observações" fullWidth />}
              />
              {/* Adicione outros campos para informações atuais conforme necessário */}
            </AnamneseSection>
            <AnamneseButton type="submit">Salvar Informações Atuais</AnamneseButton>
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

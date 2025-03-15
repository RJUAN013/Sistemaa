import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { ref, get, update, push } from 'firebase/database';
import { Button, Typography } from '@mui/material';
import database from '../../firebaseConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ControlledDate from '../ControlledDate';
import ControlledInput from '../ControlledInput';
import ControlledAttachment from '../ControlledAttachment';
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
  const [requiredFields, setRequiredFields] = useState({}); // Configurações do Painel de Controle
  const printRef = useRef();

  useEffect(() => {
    // Carregar configurações de obrigatoriedade
    const loadSettings = async () => {
      try {
        const settingsRef = ref(database, 'settings/anamnese');
        const snapshot = await get(settingsRef);

        if (snapshot.exists()) {
          setRequiredFields(snapshot.val()); // Carrega as configurações
        } else {
          console.error("Nó 'settings/anamnese' não encontrado no banco.");
          toast.error('Falha ao carregar configurações de obrigatoriedade.');
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
        toast.error('Erro ao carregar configurações: ' + error.message);
      }
    };

    loadSettings();
  }, []);

  const fetchPatientData = async (cpf) => {
    try {
      setLoading(true);
      const patientRef = ref(database, 'pacientes');
      const snapshot = await get(patientRef);

      if (snapshot.exists()) {
        const patients = snapshot.val();
        const patient = Object.values(patients).find((p) => p.cpf === cpf);

        if (patient) {
          setPatientData(patient);
          setValue('nome', patient.nome);
          setValue('dataNascimento', patient.dataNascimento);
          setValue('sexo', patient.sexo);
          setValue('cor', patient.cor);
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
      const anamneseRef = ref(database, `anamneses/${patientData.id}`);
      const newAnamneseRef = push(anamneseRef);

      await update(newAnamneseRef, {
        ...data,
        status: 'aberto',
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
        <PrintContainer ref={printRef} key={patientData.id || 'default-key'}>
          {/* Dados Pessoais */}
          <AnamneseSection>
            <Typography variant="h6">Dados Pessoais</Typography>
            <ControlledInput
              name="nome"
              control={control}
              label="Nome Completo"
              inputType="text"
              disabled
            />
            <ControlledDate
              name="dataNascimento"
              control={control}
              label="Data de Nascimento"
              disabled
            />
            <ControlledInput
              name="sexo"
              control={control}
              label="Sexo"
              inputType="text"
              disabled
            />
            <ControlledInput
              name="cor"
              control={control}
              label="Cor"
              inputType="text"
              disabled
            />
          </AnamneseSection>

          {/* Dados Físicos */}
          <AnamneseSection>
            <Typography variant="h6">Dados Físicos</Typography>
            <ControlledInput
              name="altura"
              control={control}
              label="Altura"
              inputType="decimal"
              rules={requiredFields.altura ? { required: "Altura é obrigatória" } : {}}
            />
            <ControlledInput
              name="peso"
              control={control}
              label="Peso"
              inputType="decimal"
              rules={requiredFields.peso ? { required: "Peso é obrigatório" } : {}}
            />
            <ControlledInput
              name="tipoSanguineo"
              control={control}
              label="Tipo Sanguíneo"
              inputType="text"
              rules={requiredFields.tipoSanguineo ? { required: "Tipo Sanguíneo é obrigatório" } : {}}
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
              rules={requiredFields.alergias ? { required: "Alergias são obrigatórias" } : {}}
            />
            <ControlledInput
              name="doencasCronicas"
              control={control}
              label="Doenças Crônicas"
              inputType="text"
              rules={requiredFields.doencasCronicas ? { required: "Doenças Crônicas são obrigatórias" } : {}}
            />
            <ControlledInput
              name="usoDeMedicamentos"
              control={control}
              label="Uso de Medicamentos"
              inputType="text"
              rules={requiredFields.usoDeMedicamentos ? { required: "Uso de Medicamentos é obrigatório" } : {}}
            />
            <ControlledInput
              name="cirurgiasAnteriores"
              control={control}
              label="Cirurgias Anteriores"
              inputType="text"
              rules={requiredFields.cirurgiasAnteriores ? { required: "Cirurgias Anteriores são obrigatórias" } : {}}
            />
            <ControlledInput
              name="historicoFamiliarDeDoencas"
              control={control}
              label="Histórico Familiar de Doenças"
              inputType="text"
              rules={requiredFields.historicoFamiliarDeDoencas ? { required: "Histórico Familiar é obrigatório" } : {}}
            />
          </AnamneseSection>

          {/* Hábitos de Vida */}
          <AnamneseSection>
            <Typography variant="h6">Hábitos de Vida</Typography>
            <ControlledInput
              name="habitosDeVida"
              control={control}
              label="Hábitos de Vida"
              inputType="text"
              rules={requiredFields.habitosDeVida ? { required: "Hábitos de Vida são obrigatórios" } : {}}
            />
          </AnamneseSection>

          {/* Informações Atuais */}
          <AnamneseSection>
            <Typography variant="h6">Informações Atuais</Typography>
            <ControlledInput
            name="sintomas"
            control={control}
            label="Sintomas"
            inputType="text"
            rules={requiredFields.sintomas ? { required: "Sintomas são obrigatórios" } : {}}
          />
          <ControlledInput
            name="motivoConsulta"
            control={control}
            label="Motivo da Consulta"
            inputType="text"
            rules={requiredFields.motivoConsulta ? { required: "Motivo da Consulta é obrigatório" } : {}}
          />
          <ControlledInput
            name="observacoes"
            control={control}
            label="Observações"
            inputType="text"
            rules={requiredFields.observacoes ? { required: "Observações são obrigatórias" } : {}}
          />
        </AnamneseSection>

        {/* Anexar Exames */}
        <AnamneseSection>
          <Typography variant="h6">Exames do Paciente</Typography>
          <ControlledAttachment
            name="exames"
            control={control}
            label="Anexar Exames"
            rules={requiredFields.anexarExames ? { required: "Por favor, anexe pelo menos um exame." } : {}}
          />
        </AnamneseSection>

        {/* Botão para Iniciar Atendimento */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <AnamneseButton type="submit">Iniciar Atendimento</AnamneseButton>
        </form>
      </PrintContainer>
    )}

    {/* Botão para Imprimir Anamnese */}
    <Button variant="contained" color="primary" onClick={handlePrint}>
      Imprimir Anamnese
    </Button>

    <ToastContainer />
  </AnamneseContainer>
  );
};

export default Anamnese;

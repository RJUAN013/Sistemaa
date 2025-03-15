import React, { useState, useEffect } from 'react';
import { ref, get, set } from 'firebase/database';
import { Tabs, Tab, Box, Typography, FormControlLabel, Checkbox } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import database from '../../firebaseConfig';
import {
  PainelContainer,
  PainelTitle,
  PainelCard,
  PainelForm,
  PainelButton,
} from './PainelControle.styles';

const PainelControle = () => {
  const [tabValue, setTabValue] = useState(0);
  const [fields, setFields] = useState({
    // Campos do Painel Paciente
    nome: true,
    dataNascimento: true,
    sexo: true,
    cor: true,
    estadoCivil: true,
    telefone: false,
    profissao: false,
    email: true,
    cpf: true,
    logradouro: true,
    numero: true,
    complemento: false,
    cidade: true,
    pais: true,
    estado: true,
    cep: true,
    referencia: false,
    // Campos do Painel Anamnese
    altura: true,
    historicoFamiliarDeDoencas: true,
    tipoSanguineo: true,
    usoDeMedicamentos: true,
    sintomas: true,
    anexarExames: true,
    alergias: true,
    cirurgiasAnteriores: true,
    motivoConsulta: true,
    peso: true,
    doencasCronicas: true,
    habitosDeVida: true,
    observacoes: true,
  });

  const fieldLabels = {
    // Campos do Painel Paciente
    nome: "Nome Completo",
    dataNascimento: "Data de Nascimento",
    sexo: "Sexo",
    cor: "Cor",
    estadoCivil: "Estado Civil",
    telefone: "Telefone",
    profissao: "Profissão",
    email: "E-mail",
    cpf: "CPF",
    logradouro: "Logradouro",
    numero: "Número",
    complemento: "Complemento",
    cidade: "Cidade/Município",
    pais: "País",
    estado: "Estado/UF",
    cep: "CEP",
    referencia: "Ponto de Referência",
    // Campos do Painel Anamnese
    altura: "Altura",
    historicoFamiliarDeDoencas: "Histórico Familiar de Doenças",
    tipoSanguineo: "Tipo Sanguíneo",
    usoDeMedicamentos: "Uso de Medicamentos",
    sintomas: "Sintomas",
    anexarExames: "Anexar Exames",
    alergias: "Alergias",
    cirurgiasAnteriores: "Cirurgias Anteriores",
    motivoConsulta: "Motivo da Consulta",
    peso: "Peso",
    doencasCronicas: "Doenças Crônicas",
    habitosDeVida: "Hábitos de Vida",
    observacoes: "Observações",
  };

  useEffect(() => {
    const loadSettings = async () => {
      const settingsRef = ref(database, 'settings/cadastroPaciente');
      const snapshot = await get(settingsRef);
      if (snapshot.exists()) {
        setFields(snapshot.val());
      }
    };
    loadSettings();
  }, []);

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChangeCheckbox = (event) => {
    setFields({ ...fields, [event.target.name]: event.target.checked });
  };

  const handleSave = async () => {
    try {
      const settingsRef = ref(database, 'settings/cadastroPaciente');
      await set(settingsRef, fields);
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações: ' + error.message);
    }
  };

  return (
    <PainelContainer>
      <PainelTitle>Painel de Controle</PainelTitle>
      <PainelCard>
        <Tabs value={tabValue} onChange={handleChangeTab} aria-label="Painel Controle Tabs">
          <Tab label="Painel Paciente" />
          <Tab label="Painel Anamnese" />
        </Tabs>
        {/* Aba "Painel Paciente" */}
        <TabPanel value={tabValue} index={0}>
          <PainelForm>
            {Object.keys(fields)
              .filter((field) => [
                "nome", "dataNascimento", "sexo", "cor", "estadoCivil",
                "telefone", "profissao", "email", "cpf", "logradouro",
                "numero", "complemento", "cidade", "pais", "estado", "cep", "referencia",
              ].includes(field))
              .map((field) => (
                <FormControlLabel
                  key={field}
                  control={
                    <Checkbox
                      checked={fields[field]}
                      onChange={handleChangeCheckbox}
                      name={field}
                    />
                  }
                  label={fieldLabels[field]}
                />
              ))}
            <PainelButton onClick={handleSave}>Salvar Configurações</PainelButton>
          </PainelForm>
        </TabPanel>
        {/* Aba "Painel Anamnese" */}
        <TabPanel value={tabValue} index={1}>
          <PainelForm>
            {Object.keys(fields)
              .filter((field) => [
                "altura", "historicoFamiliarDeDoencas", "tipoSanguineo",
                "usoDeMedicamentos", "sintomas", "anexarExames", "alergias",
                "cirurgiasAnteriores", "motivoConsulta", "peso", "doencasCronicas",
                "habitosDeVida", "observacoes",
              ].includes(field))
              .map((field) => (
                <FormControlLabel
                  key={field}
                  control={
                    <Checkbox
                      checked={fields[field]}
                      onChange={handleChangeCheckbox}
                      name={field}
                    />
                  }
                  label={fieldLabels[field]}
                />
              ))}
            <PainelButton onClick={handleSave}>Salvar Configurações</PainelButton>
          </PainelForm>
        </TabPanel>
      </PainelCard>
      <ToastContainer />
    </PainelContainer>
  );
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

export default PainelControle;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, get, set } from 'firebase/database';
import { Tabs, Tab, Box, Typography, FormControlLabel, Checkbox } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import database from '../../firebaseConfig';
import { PainelContainer, PainelTitle, PainelCard, PainelSection, PainelForm, PainelButton } from './PainelControle.styles';

const PainelControle = ({ currentUser }) => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [fields, setFields] = useState({
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
    altura: true,
    peso: true,
    tipoSanguineo: true,
    alergias: true,
    doencasCronicas: true,
    usoDeMedicamentos: true,
    cirurgiasAnteriores: true,
    historicoFamiliarDeDoencas: true,
    habitosDeVida: true
  });

  useEffect(() => {
    // Verifique se o usuário é um administrador
    if (currentUser.type !== 'admin' && currentUser.type !== 'master') {
      toast.error('Acesso negado. Apenas administradores podem acessar esta página.');
      navigate('/');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    // Carregar as configurações salvas do banco de dados
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
        <PainelTitle>Painel de Controle - Painel Paciente</PainelTitle>
      <PainelCard>
        <Tabs value={tabValue} onChange={handleChangeTab} aria-label="Painel Controle Tabs">
          <Tab label="Painel Paciente" />
          <Tab label="Painel" />
        </Tabs>
        <TabPanel value={tabValue} index={0}>
          <PainelForm>
            <PainelSection>
              {Object.keys(fields).map((field) => (
                <FormControlLabel
                  key={field}
                  control={
                    <Checkbox
                      checked={fields[field]}
                      onChange={handleChangeCheckbox}
                      name={field}
                    />
                  }
                  label={field}
                />
              ))}
            </PainelSection>
            <PainelButton type="button" onClick={handleSave}>
              Salvar Configurações
            </PainelButton>
          </PainelForm>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
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
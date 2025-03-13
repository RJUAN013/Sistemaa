import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ref, get, query, orderByChild, equalTo, set } from 'firebase/database';
import { getNextId } from '../../firebaseConfig';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import ControlledInput from '../ControlledInput.js';
import ControlledRadio from '../ControlledRadio.js';
import ControlledDate from '../ControlledDate.js';
import ControlledEmail from '../ControlledEmail.js';
import ControlledSelect from '../ControlledSelect.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  CadastroContainer,
  CadastroTitle,
  CadastroForm,
  Card,
  InforSection,
  CampoSection,
  CadastroButton,
  CadastroSection,
  CadastroSectionTitle,
} from './CadastroPaciente.styles';
import database from '../../firebaseConfig';

const CadastroPaciente = () => {
  const { control, handleSubmit, setValue, watch, trigger, formState: { errors }, setFocus } = useForm();
  const [tabValue, setTabValue] = React.useState(0);
  const [requiredFields, setRequiredFields] = useState({});

  useEffect(() => {
    // Carregar as configurações de campos obrigatórios do banco de dados
    const loadSettings = async () => {
      const settingsRef = ref(database, 'settings/cadastroPaciente');
      const snapshot = await get(settingsRef);
      if (snapshot.exists()) {
        setRequiredFields(snapshot.val());
      }
    };
    loadSettings();
  }, []);

  const handleChange = async (event, newValue) => {
    const isValid = await trigger(); // Verifica todos os campos da aba atual

    if (isValid) {
      setTabValue(newValue);
    } else {
      // Se houver erros, encontra o primeiro campo com erro e foca nele
      const firstErrorField = Object.keys(errors)[0];
      const fieldLabel = errors[firstErrorField]?.message || "Por favor, preencha todos os campos obrigatórios.";
      setFocus(firstErrorField);
      toast.error(`Erro no campo: ${fieldLabel}`);
    }
  };

  const onSubmit = async (data) => {
    const result = await trigger(); // Verifica todos os campos
    if (!result) {
      // Se houver erros, encontra o primeiro campo com erro e muda para a aba correspondente
      if (errors.numero) {
        setTabValue(0);
        setFocus('numero');
      }
      return;
    }

    const campoDuplicado = await verificarDuplicidade(data);
    if (campoDuplicado) {
      alert(`Já existe cadastro com esse ${campoDuplicado}`);
      return;
    }

    const pacienteId = await getNextId();
    const nomeIncremental = `${String(pacienteId).padStart(5, '0')}`;
    const novoPaciente = {
      ...data,
      id: pacienteId,
      cod: nomeIncremental,
      planoSaude: data.hasPlanoSaude ? data.planoSaude : '',
      matriculaPlano: data.hasPlanoSaude ? data.matriculaPlano : '',
    };
    const pacienteRef = ref(database, 'pacientes/' + pacienteId);
    set(pacienteRef, novoPaciente)
      .then(() => {
        alert('Paciente cadastrado com sucesso!');
      })
      .catch((error) => {
        alert('Erro ao cadastrar paciente: ' + error.message);
      });
  };

  const verificarDuplicidade = async (data) => {
    const pacienteRef = ref(database, 'pacientes');
    const queries = [
      { field: 'cpf', value: data.cpf, label: 'CPF' },
      { field: 'rg', value: data.rg, label: 'RG' },
      { field: 'cartaoSus', value: data.cartaoSus, label: 'Cartão SUS' }
    ];

    for (const queryObj of queries) {
      if (queryObj.value) {
        const q = query(pacienteRef, orderByChild(queryObj.field), equalTo(queryObj.value));
        const snapshot = await get(q);
        if (snapshot.exists()) {
          return queryObj.label;
        }
      }
    }
    return null;
  };

  return (
    <CadastroContainer>
      <Card>
        <CadastroTitle>Cadastro de Paciente</CadastroTitle>
        <Tabs value={tabValue} onChange={handleChange} aria-label="Cadastro Tabs">
          <Tab label="Informações de Cadastro" />
          <Tab label="Informações Médicas" />
        </Tabs>
        <TabPanel value={tabValue} index={0}>
          <CadastroForm onSubmit={handleSubmit(onSubmit)}>
            <CadastroSection>
              <CadastroSectionTitle>Informações Pessoais</CadastroSectionTitle>
              <InforSection>
                <CampoSection>
                  <ControlledInput
                    name="nome"
                    control={control}
                    label="Nome Completo"
                    type="text"
                    rules={requiredFields.nome ? { required: "Nome é obrigatório" } : {}}
                  />
                  <ControlledDate
                    name="dataNascimento"
                    control={control}
                    label="Data de Nascimento"
                    rules={requiredFields.dataNascimento ? { required: "Data de Nascimento é obrigatório" } : {}}
                  />
                  <ControlledSelect
                    name="sexo"
                    control={control}
                    label="Sexo"
                    type="sexo"
                    rules={requiredFields.sexo ? { required: "Sexo é obrigatório" } : {}}
                  />
                  <ControlledSelect
                    name="cor"
                    control={control}
                    label="Cor"
                    type="cor"
                    rules={requiredFields.cor ? { required: "Cor é obrigatória" } : {}}
                  />
                </CampoSection>
                <CampoSection>
                  <ControlledSelect
                    name="estadoCivil"
                    control={control}
                    label="Estado Civil"
                    type="estadoCivil"
                    rules={requiredFields.estadoCivil ? { required: "Estado Civil é obrigatório" } : {}}
                  />
                  <ControlledInput
                    name="telefone"
                    control={control}
                    label="Contato"
                    type="integer"
                    rules={requiredFields.telefone ? { required: "Telefone é obrigatório" } : {}}
                  />
                  <ControlledInput
                    name="profissao"
                    control={control}
                    label="Profissão"
                    type="text"
                    rules={requiredFields.profissao ? { required: "Profissão é obrigatória" } : {}}
                  />
                  <ControlledEmail
                    name="email"
                    control={control}
                    label="E-mail"
                    rules={requiredFields.email ? { required: "E-mail é obrigatório" } : {}}
                  />
                </CampoSection>
              </InforSection>
            </CadastroSection>
            <CadastroSection>
              <CadastroSectionTitle>Informações do Responsável</CadastroSectionTitle>
              <InforSection>
                <CampoSection>
                  <ControlledRadio
                    control={control}
                    setValue={setValue}
                    watch={watch}
                    inputType="responsavel"
                  />
                </CampoSection>
              </InforSection>
            </CadastroSection>
            <CadastroSection>
              <CadastroSectionTitle>Documentação</CadastroSectionTitle>
              <InforSection>
                <CampoSection>
                  <ControlledInput
                    name="cpf"
                    control={control}
                    label="CPF"
                    type="cpf"
                    rules={requiredFields.cpf ? { required: "CPF é obrigatório" } : {}}
                  />
                  <ControlledInput
                    name="rg"
                    control={control}
                    label="RG"
                    type="integer"
                    rules={requiredFields.rg ? { required: "RG é obrigatório" } : {}}
                  />
                  <ControlledInput
                    name="cartaoSus"
                    control={control}
                    label="Cartão SUS"
                    type="integer"
                    rules={requiredFields.cartaoSus ? { required: "Cartão SUS é obrigatório" } : {}}
                  />
                </CampoSection>
                <CampoSection>
                  <ControlledRadio
                    control={control}
                    setValue={setValue}
                    watch={watch}
                    inputType="planoSaude"
                  />
                </CampoSection>
              </InforSection>
            </CadastroSection>
            <CadastroSection>
              <CadastroSectionTitle>Endereço</CadastroSectionTitle>
              <InforSection>
                <CampoSection>
                  <ControlledInput
                    name="logradouro"
                    control={control}
                    label="Endereço"
                    type="text"
                    rules={requiredFields.logradouro ? { required: "Endereço é obrigatório" } : {}}
                    placeholder="Rua, Ave, Logradouro..."
                  />
                  <ControlledInput
                    name="numero"
                    control={control}
                    label="Número"
                    type="integer"
                    rules={requiredFields.numero ? { required: "Número é obrigatório" } : {}}
                  />
                  <ControlledSelect
                    name="complemento"
                    control={control}
                    label="Complemento"
                    type="complemento"
                    rules={requiredFields.complemento ? { required: "Complemento é obrigatório" } : {}}
                  />
                  <ControlledInput
                    name="cidade"
                    control={control}
                    label="Cidade/Município"
                    type="text"
                    rules={requiredFields.cidade ? { required: "Cidade/Município é obrigatória" } : {}}
                  />
                </CampoSection>
                <CampoSection>
                  <ControlledSelect
                    name="pais"
                    control={control}
                    label="País"
                    type="pais"
                    rules={requiredFields.pais ? { required: "País é obrigatório" } : {}}
                  />
                  <ControlledSelect
                    name="estado"
                    control={control}
                    label="Estado/UF"
                    type="estado"
                    rules={requiredFields.estado ? { required: "Estado/UF é obrigatório" } : {}}
                  />
                  <ControlledInput
                    name="cep"
                    control={control}
                    label="CEP"
                    type="integer"
                    rules={requiredFields.cep ? { required: "CEP é obrigatório" } : {}}
                  />
                  <ControlledInput
                    name="referencia"
                    control={control}
                    label="Ponto de Referência"
                    type="text"
                    rules={requiredFields.referencia ? { required: "Ponto de Referência é obrigatório" } : {}}
                  />
                </CampoSection>
              </InforSection>
            </CadastroSection>
            <CadastroButton type="submit">Salvar</CadastroButton>
          </CadastroForm>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <CadastroForm onSubmit={handleSubmit(onSubmit)}>
            <CadastroSection>
              <CadastroSectionTitle>Histórico de Saúde</CadastroSectionTitle>
              <InforSection>
                <CampoSection>
                  <ControlledInput
                    name="alergias"
                    control={control}
                    label="Alergias"
                    type="text"
                    rules={requiredFields.alergias ? { required: "Alergias são obrigatórias" } : {}}
                  />
                  <ControlledInput
                    name="doencasCronicas"
                    control={control}
                    label="Doenças Crônicas"
                    type="text"
                    rules={requiredFields.doencasCronicas ? { required: "Doenças Crônicas são obrigatórias" } : {}}
                  />
                  <ControlledInput
                    name="cirurgiasAnteriores"
                    control={control}
                    label="Cirurgias Anteriores"
                    type="text"
                    rules={requiredFields.cirurgiasAnteriores ? { required: "Cirurgias Anteriores são obrigatórias" } : {}}
                  />
                  <ControlledInput
                    name="historicoFamiliarDeDoencas"
                    control={control}
                    label="Histórico Familiar de Doenças"
                    type="text"
                    rules={requiredFields.historicoFamiliarDeDoencas ? { required: "Histórico Familiar de Doenças é obrigatório" } : {}}
                  />
                  <ControlledInput
                    name="habitosDeVida"
                    control={control}
                    label="Hábitos de Vida"
                    type="text"
                    rules={requiredFields.habitosDeVida ? { required: "Hábitos de Vida são obrigatórios" } : {}}
                  />
                </CampoSection>
              </InforSection>
            </CadastroSection>
            <CadastroButton type="submit">Salvar</CadastroButton>
          </CadastroForm>
        </TabPanel>
      </Card>
      <ToastContainer />
    </CadastroContainer>
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

export default CadastroPaciente;
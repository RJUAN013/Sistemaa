import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ref, get, set } from 'firebase/database';
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

  const onSubmit = async (data) => {
    const result = await trigger(); // Verifica todos os campos
    if (!result) {
      // Se houver erros, encontra o primeiro campo com erro e foca nele
      const firstErrorField = Object.keys(errors)[0];
      const fieldLabel = errors[firstErrorField]?.message || "Por favor, preencha todos os campos obrigatórios.";
      setFocus(firstErrorField);
      toast.error(`Erro no campo: ${fieldLabel}`);
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
        toast.success('Paciente cadastrado com sucesso!');
      })
      .catch((error) => {
        toast.error('Erro ao cadastrar paciente: ' + error.message);
      });
  };

  return (
    <CadastroContainer>
      <Card>
        <CadastroTitle>Cadastro de Paciente</CadastroTitle>
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
import React from 'react';
import { useForm } from 'react-hook-form';
import { ref, get, query, orderByChild, equalTo, set } from 'firebase/database';
import { getNextId } from '../../firebaseConfig';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import ControlledInput from '../ControlledInput.js';
import ControlledRadio from '../ControlledRadio.js';
import ControlledDate from '../ControlledDate.js';
import ControlledEmail from '../ControlledEmail.js';
import ControlledSelect from '../ControlledSelect.js';
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

  const handleChange = async (event, newValue) => {
    const isValid = await trigger(); // Verifica todos os campos da aba atual

    if (isValid) {
      setTabValue(newValue);
    } else {
      // Se houver erros, encontra o primeiro campo com erro e foca nele
      const firstErrorField = Object.keys(errors)[0];
      setFocus(firstErrorField);
      alert(`O campo ${firstErrorField} é obrigatório`);
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
                    rules={{ required: "Nome é obrigatório" }}
                  />
                  <ControlledDate
                    name="dataNascimento"
                    control={control}
                    label="Data de Nascimento"
                    rules={{}}
                  />
                  <ControlledSelect
                    name="sexo"
                    control={control}
                    label="Sexo"
                    type="sexo"
                    rules={{ required: "Sexo é obrigatório" }}
                  />
                  <ControlledSelect
                    name="cor"
                    control={control}
                    label="Cor"
                    type="cor"
                    rules={{ required: "Cor é obrigatória" }}
                  />
                </CampoSection>
                <CampoSection>
                  <ControlledSelect
                    name="estadoCivil"
                    control={control}
                    label="Estado Civil"
                    type="estadoCivil"
                    rules={{ required: "Estado Civil é obrigatório" }}
                  />
                  <ControlledInput
                    name="telefone"
                    control={control}
                    label="Contato"
                    type="integer"
                    rules={{ required: "Telefone é obrigatório" }}
                  />
                  <ControlledInput
                    name="profissao"
                    control={control}
                    label="Profissão"
                    type="text"
                    rules={{ required: "Profissão é obrigatória" }}
                  />
                  <ControlledEmail
                    name="email"
                    control={control}
                    label="E-mail"
                    rules={{ required: "E-mail é obrigatório" }}
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
                    rules={{ required: "CPF é obrigatório" }}
                  />
                  <ControlledInput
                    name="rg"
                    control={control}
                    label="RG"
                    type="integer"
                    rules={{ required: "RG é obrigatório" }}
                  />
                  <ControlledInput
                    name="cartaoSus"
                    control={control}
                    label="Cartão SUS"
                    type="integer"
                    rules={{ required: "Cartão SUS é obrigatório" }}
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
                    rules={{ required: "Endereço é obrigatório" }}
                    placeholder="Rua, Ave, Logradouro..."
                  />
                  <ControlledInput
                    name="numero"
                    control={control}
                    label="Número"
                    type="integer"
                    rules={{ required: "Número é obrigatório" }}
                  />
                  <ControlledSelect
                    name="complemento"
                    control={control}
                    label="Complemento"
                    type="complemento"
                    rules={{}}
                  />
                  <ControlledInput
                    name="cidade"
                    control={control}
                    label="Cidade/Município"
                    type="text"
                    rules={{ required: "Cidade/Município é obrigatória" }}
                  />
                </CampoSection>
                <CampoSection>
                  <ControlledSelect
                    name="pais"
                    control={control}
                    label="País"
                    type="pais"
                    rules={{ required: "País é obrigatório" }}
                  />
                  <ControlledSelect
                    name="estado"
                    control={control}
                    label="Estado/UF"
                    type="estado"
                    rules={{ required: "Estado/UF é obrigatório" }}
                  />
                  <ControlledInput
                    name="cep"
                    control={control}
                    label="CEP"
                    type="integer"
                    rules={{ required: "CEP é obrigatório" }}
                  />
                  <ControlledInput
                    name="referencia"
                    control={control}
                    label="Ponto de Referência"
                    type="text"
                   
                  />
                </CampoSection>
              </InforSection>
            </CadastroSection>
            <CadastroButton type="button" onClick={(e) => handleChange(e, 1)}>Próximo</CadastroButton>
          </CadastroForm>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <CadastroForm onSubmit={handleSubmit(onSubmit)}>
            <CadastroSection>
              <CadastroSectionTitle>Dados Físicos</CadastroSectionTitle>
              <InforSection>
                <CampoSection>
                  <ControlledInput
                    name="altura"
                    control={control}
                    label="Altura"
                    type="decimal"
                    rules={{ required: "Altura é obrigatório" }}
                  />
                  <ControlledInput
                    name="peso"
                    control={control}
                    label="Peso"
                    type="decimal"
                    rules={{ required: "Peso é obrigatorio" }}
                  />
                  <ControlledInput
                    name="tipoSanguineo"
                    control={control}
                    label="Tipo Sanguíneo"
                    type="text"
                    rules={{ required: "Tipo Sanguíneo  é obrigatório" }}
                  />
                </CampoSection>
              </InforSection>
            </CadastroSection>
            <CadastroSection>
              <CadastroSectionTitle>Histórico de Saúde</CadastroSectionTitle>
              <InforSection>
                <CampoSection>
                  <ControlledInput
                    name="alergias"
                    control={control}
                    label="Alergias"
                    type="text"
                    rules={{ required: "Alergias é obrigatório" }}
                  />
                  <ControlledInput
                    name="doençasCronicas"
                    control={control}
                    label="Doenças Crônicas"
                    type="text"
                    rules={{ required: "Doenças Cônicas são obrigtórios" }}
                  />
                  <ControlledInput
                    name="usoDeMedicamentos"
                    control={control}
                    label="Uso de Medicamentos"
                    type="text"
                    rules={{ required: "Uso de Medicamentos são obrigatósrias" }}
                  />
                </CampoSection>
                <CampoSection>
                  <ControlledInput
                    name="cirurgiasAnteriores"
                    control={control}
                    label="Cirurgias Anteriores"
                    type="text"
                    rules={{ required: "Cirurgias Amteriores é obrigatorio" }}
                  />
                  <ControlledInput
                    name="historicoFamiliarDeDoenças"
                    control={control}
                    label="Histórico Familia de Doenças"
                    type="text"
                    rules={{ required: "Histórico Familiar de Doenças é obrigatorio" }}
                  />
                  <ControlledInput
                    name="habitosDeVida"
                    control={control}
                    label="Hábitos de Vida"
                    type="text"
                    rules={{ required: "Hábitos de Vida é obrigatorio" }}
                  />
                </CampoSection>
              </InforSection>
            </CadastroSection>
            <CadastroButton type="submit">Salvar</CadastroButton>
          </CadastroForm>
        </TabPanel>
      </Card>
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
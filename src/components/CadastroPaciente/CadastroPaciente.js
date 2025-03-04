import React from 'react';
import { useForm } from 'react-hook-form';
import { ref, get, query, orderByChild, equalTo, set } from 'firebase/database';
import { getNextId } from '../../firebaseConfig';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import ControlledCampoTexto from "../ControlledCampoTexto";
import ControlledCampoPais from "../ControlledCampoPais.js";
import ControlledCampoUF from "../ControlledCampoUF.js";
import ControlledCampoComplemento from '../ControlledCampoComplemento.js';
import ControlledCampoNumero from '../ControlledCampoNumero';
import ControlledCampoData from '../ControlledCampoData.js';
import ControlledCampoCpf from '../ControlledCampoCpf.js';
import ControlledCampoCor from '../ControlledCampoCor.js';
import ControlledCampoSexo from '../ControlledCampoSexo.js';
import ControlledCampoEmail from '../ControlledCampoEmail.js';
import ControlledCampoEstadoCivil from '../ControlledCampoEstadoCivil.js';
import ControlledPlanoSaude from '../ControlledCampoPlanoDeSaude.js';
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
                  <ControlledCampoTexto
                    name="nome"
                    control={control}
                    label="Nome Completo"
                    rules={{ required: "Nome é obrigatório" }}
                  />
                  <ControlledCampoData
                    name="dataNascimento"
                    control={control}
                    label="Data de Nascimento"
                    rules={{}}
                  />
                  <ControlledCampoSexo
                    name="sexo"
                    control={control}
                    label="Sexo"
                    rules={{ required: "Sexo é obrigatório" }}
                  />
                  <ControlledCampoCor
                    name="cor"
                    control={control}
                    label="Cor"
                    rules={{ required: "Cor é obrigatória" }}
                  />
                </CampoSection>
                <CampoSection>
                  <ControlledCampoEstadoCivil
                    name="estadoCivil"
                    control={control}
                    label="Estado Civil"
                    rules={{ required: "Estado Civil é obrigatório" }}
                  />
                  <ControlledCampoNumero
                    name="telefone"
                    control={control}
                    label="Contato"
                    rules={{ required: "Telefone é obrigatório" }}
                  />
                  <ControlledCampoTexto
                    name="profissao"
                    control={control}
                    label="Profissão"
                    rules={{ required: "Profissão é obrigatória" }}
                  />
                  <ControlledCampoEmail
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
                  <ControlledCampoTexto
                    name="nomeResponsavel"
                    control={control}
                    label="Nome do Responsável"
                    rules={{ required: "Nome é obrigatório" }}
                    placeholder="Rua, Ave, Logradouro..."
                  />
                  <ControlledCampoNumero
                    name="telefoneResponsavelPrincipal"
                    control={control}
                    label="Contato do Responsável Principal"
                    rules={{ required: "Telefone do Responsável é obrigatório" }}
                  />
                  <ControlledCampoNumero
                    name="telefoneResponsavelSecundario"
                    control={control}
                    label="Contato do Responsável Secundário"
                    rules={{}}
                  />
                </CampoSection>
              </InforSection>
            </CadastroSection>
            <CadastroSection>
              <CadastroSectionTitle>Documentação</CadastroSectionTitle>
              <InforSection>
                <CampoSection>
                  <ControlledCampoCpf
                    name="cpf"
                    control={control}
                    label="CPF"
                    rules={{ required: "CPF é obrigatório" }}
                  />
                  <ControlledCampoNumero
                    name="rg"
                    control={control}
                    label="RG"
                    rules={{ required: "RG é obrigatório" }}
                  />
                  <ControlledCampoNumero
                    name="cartaoSus"
                    control={control}
                    label="Cartão SUS"
                    rules={{ required: "Cartão SUS é obrigatório" }}
                  />
                </CampoSection>
                <CampoSection>
                  <ControlledPlanoSaude control={control} setValue={setValue} watch={watch} />
                </CampoSection>
              </InforSection>
            </CadastroSection>
            <CadastroSection>
              <CadastroSectionTitle>Endereço</CadastroSectionTitle>
              <InforSection>
                <CampoSection>
                  <ControlledCampoTexto
                    name="logradouro"
                    control={control}
                    label="Endereço"
                    rules={{ required: "Endereço é obrigatório" }}
                    placeholder="Rua, Ave, Logradouro..."
                  />
                  <ControlledCampoNumero
                    name="numero"
                    control={control}
                    label="Número"
                    rules={{
                      required: "Número é obrigatório"
                    }}
                  />
                  <ControlledCampoComplemento
                    name="complemento"
                    control={control}
                    label="Complemento"
                    rules={{}}
                  />
                  <ControlledCampoTexto
                    name="cidade"
                    control={control}
                    label="Cidade/Município"
                    rules={{ required: "Cidade/Município é obrigatória" }}
                  />
                </CampoSection>
                <CampoSection>
                  <ControlledCampoPais
                    name="pais"
                    control={control}
                    label="País"
                    rules={{ required: "País é obrigatório" }}
                  />
                  <ControlledCampoUF
                    name="estado"
                    control={control}
                    label="Estado/UF"
                    rules={{ required: "Estado/UF é obrigatório" }}
                  />
                  <ControlledCampoNumero
                    name="cep"
                    control={control}
                    label="CEP"
                    rules={{ required: "CEP é obrigatório" }}
                  />
                  <ControlledCampoTexto
                    name="referencia"
                    control={control}
                    label="Ponto de Referência"
                    rules={{ required: "Ponto de referência é obrigatório" }}
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
                  <ControlledCampoNumero
                    name="altura"
                    control={control}
                    label="Altura"
                    rules={{ required: "Altura é obrigatório" }}
                  />
                  <ControlledCampoNumero
                    name="peso"
                    control={control}
                    label="Peso"
                    rules={{ required: "Peso é obrigatorio" }}
                  />
                  <ControlledCampoTexto
                    name="tipoSanguineo"
                    control={control}
                    label="Tipo Sanguíneo"
                    rules={{ required: "Tipo Sanguíneo  é obrigatório" }}
                  />
                </CampoSection>
              </InforSection>
            </CadastroSection>
            <CadastroSection>
              <CadastroSectionTitle>Histórico de Saúde</CadastroSectionTitle>
              <InforSection>
                <CampoSection>
                  <ControlledCampoTexto
                    name="alergias"
                    control={control}
                    label="Alergias"
                    rules={{ required: "Alergias é obrigatório" }}
                    multiline
                  />
                  <ControlledCampoTexto
                    name="doençasCronicas"
                    control={control}
                    label="Doenças Crônicas"
                    rules={{ required: "Doenças Cônicas são obrigtórios" }}
                  />
                  <ControlledCampoTexto
                    name="usoDeMedicamentos"
                    control={control}
                    label="Uso de Medicamentos"
                    rules={{ required: "Uso de Medicamentos são obrigatósrias" }}
                  />
                </CampoSection>
                <CampoSection>
                  <ControlledCampoTexto
                    name="cirurgiasAnteriores"
                    control={control}
                    label="Cirurgias Anteriores"
                    rules={{ required: "Cirurgias Amteriores é obrigatorio" }}
                  />
                  <ControlledCampoTexto
                    name="historicoFamiliarDeDoenças"
                    control={control}
                    label="Histórico Familia de Doenças"
                    rules={{ required: "Histórico Familiar de Doenças é obrigatorio" }}
                  />
                  <ControlledCampoTexto
                    name="habitosDeVida"
                    control={control}
                    label="Hábitos de Vida"
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
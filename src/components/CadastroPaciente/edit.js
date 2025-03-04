import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ref, get, query, orderByChild, equalTo, set } from 'firebase/database';
import { getNextId } from '../../firebaseConfig';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, TextField, MenuItem, Tabs, Tab, Box, Typography, Button  } from '@mui/material';
import ControlledCampoTexto from "../ControlledCampoTexto";
import ControlledSelectPais from "../ControlledSelectPais";
import ControlledSelectUF from "../ControlledSelectUF";
import ControlledSelectComplemento from '../ControlledSelectComplemento';
import ControlledCampoNumero from '../ControlledCampoNumero';
import ControlledFieldData from '../ControlledFieldData';
import {
  CadastroContainer,
  CadastroTitle,
  CadastroForm,
  Card,
  InforSection,
  CampoSection,
  CadastroButton,
  ButtonProximo,
  CadastroSection,
  CadastroSectionTitle,
} from './CadastroPaciente.styles';
import database from '../../firebaseConfig';

const CadastroPaciente = () => {
  const { control, handleSubmit, setValue, watch, trigger, formState: { errors }, setFocus } = useForm();
  const [tabValue, setTabValue] = React.useState(0);

  const handleChange = async (event, newValue) => {
    // Verificar se os campos da aba atual são válidos antes de mudar de aba
    const isValid = await trigger(); // Verifica todos os campos da aba atual

    if (isValid) {
      setTabValue(newValue);
    } else {
      // Se houver erros, encontra o primeiro campo com erro e foca nele
      if (errors.numero) {
        setFocus('numero');
        setTabValue(0);
      }
    }
  };

  const watchHasPlanoSaude = watch("hasPlanoSaude", false);

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

    if (!validarCpf(data.cpf)) {
      alert('CPF inválido');
      return;
    }

    if (!/^[0-9]+$/i.test(data.numero)) {
      alert('O campo "Número" deve conter apenas números');
      return;
    }

    if (!/^[0-9]+$/i.test(data.cep)) {
      alert('O campo "Número" deve conter apenas números');
      return;
    }

    if (!/^[0-9]+$/i.test(data.altura)) {
      alert('O campo "Número" deve conter apenas números');
      return;
    }

    if (!/^[0-9]+$/i.test(data.peso)) {
      alert('O campo "Número" deve conter apenas números');
      return;
    }

    if (!/^[0-9]+$/i.test(data.rg)) {
      alert('O campo "Número" deve conter apenas números');
      return;
    }

    if (!/^[0-9]+$/i.test(data.cartaoSus)) {
      alert('O campo "Número" deve conter apenas números');
      return;
    }

    if (!/^[0-9]+$/i.test(data.telefoneResponsavelPrincipal)) {
      alert('O campo "Número" deve conter apenas números');
      return;
    }

    if (!/^[0-9]+$/i.test(data.telefoneResponsavelSecundario)) {
      alert('O campo "Número" deve conter apenas números');
      return;
    }

    if (!/^[0-9]+$/i.test(data.telefone)) {
      alert('O campo "Número" deve conter apenas números');
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

  const validarCpf = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11) return false;
    let soma = 0;
    let resto;
    if (cpf === "00000000000") return false;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    return true;
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
                  <Controller
                    name="nome"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Nome é obrigatório",
                      pattern: {
                        value: /^[A-Za-z\s]+$/i,
                        message: "Apenas letras e espaços são permitidos"
                      }
                    }}
                    render={({ field, fieldState }) =>
                      <TextField
                        {...field}
                        label="Nome Completo"
                        error={!!fieldState.error}
                        helperText={fieldState.error ? fieldState.error.message : null}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ''))}
                        fullWidth
                      />
                    }
                  />
                  <Controller
                    name="dataNascimento"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Data de Nascimento é obrigatória" }}
                    render={({ field, fieldState }) =>
                      <TextField
                        {...field}
                        label="Data de Nascimento"
                        type="date"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        error={!!fieldState.error}
                        helperText={fieldState.error ? fieldState.error.message : null}
                        fullWidth
                      />
                    }
                  />
                  <Controller
                    name="sexo"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Sexo é obrigatório" }}
                    render={({ field, fieldState }) =>
                      <TextField
                        {...field}
                        label="Sexo"
                        select
                        error={!!fieldState.error}
                        helperText={fieldState.error ? fieldState.error.message : null}
                        fullWidth
                      >
                        <MenuItem value="">Selecione</MenuItem>
                        <MenuItem value="Masculino">Masculino</MenuItem>
                        <MenuItem value="Feminino">Feminino</MenuItem>
                      </TextField>
                    }
                  />
                  <Controller
                    name="cor"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Cor é obrigatória" }}
                    render={({ field, fieldState }) =>
                      <TextField
                        {...field}
                        label="Cor"
                        select
                        error={!!fieldState.error}
                        helperText={fieldState.error ? fieldState.error.message : null}
                        fullWidth
                      >
                        <MenuItem value="">Selecione</MenuItem>
                        <MenuItem value="Branca">Branca</MenuItem>
                        <MenuItem value="Preta">Preta</MenuItem>
                        <MenuItem value="Parda">Parda</MenuItem>
                        <MenuItem value="Amarela">Amarela</MenuItem>
                        <MenuItem value="Indígena">Indígena</MenuItem>
                      </TextField>
                    }
                  />
                </CampoSection>
                <CampoSection>
                  <Controller
                    name="estadoCivil"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Estado Civil é obrigatório" }}
                    render={({ field, fieldState }) =>
                      <TextField
                        {...field}
                        label="Estado Civil"
                        select
                        error={!!fieldState.error}
                        helperText={fieldState.error ? fieldState.error.message : null}
                        fullWidth
                      >
                        <MenuItem value="">Selecione</MenuItem>
                        <MenuItem value="Solteiro">Solteiro</MenuItem>
                        <MenuItem value="Casado">Casado</MenuItem>
                        <MenuItem value="Viuvo">Viuvo</MenuItem>
                        <MenuItem value="Separado">Separado</MenuItem>
                        <MenuItem value="União Estável">União Estável</MenuItem>
                      </TextField>
                    }
                  />
                  <Controller
                    name="telefone"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Telefone é obrigatório",
                      pattern: {
                        value: /^[0-9]+$/i,
                        message: "Apenas números são permitidos"
                      }
                    }}
                    render={({ field, fieldState }) =>
                      <TextField
                        {...field}
                        label="Telefone"
                        error={!!fieldState.error}
                        helperText={fieldState.error ? fieldState.error.message : null}
                        fullWidth
                      />
                    }
                  />
                  <Controller
                    name="profissao"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Profissão é obrigatória",
                      pattern: {
                        value: /^[A-Za-z\s]+$/i,
                        message: "Apenas letras e espaços são permitidos"
                      }
                    }}
                    render={({ field, fieldState }) =>
                      <TextField
                        {...field}
                        label="Profissão"
                        error={!!fieldState.error}
                        helperText={fieldState.error ? fieldState.error.message : null}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ''))}
                        fullWidth
                      />
                    }
                  />
                  <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "E-mail é obrigatório",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "E-mail inválido"
                      }
                    }}
                    render={({ field, fieldState }) =>
                      <TextField
                        {...field}
                        label="e-mail"
                        type="email"
                        error={!!fieldState.error}
                        helperText={fieldState.error ? fieldState.error.message : null}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                        value={watch("email", "").toUpperCase()}
                        fullWidth
                      />
                    }
                  />
                </CampoSection>
              </InforSection>
            </CadastroSection>
            <CadastroSection>
              <CadastroSectionTitle>Informações do Responsável</CadastroSectionTitle>
              <InforSection>
                <CampoSection>
                  <Controller
                    name="nomeResponsavel"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Nome é obrigatório",
                      pattern: {
                        value: /^[A-Za-z\s]+$/i,
                        message: "Apenas letras e espaços são permitidos"
                      }
                    }}
                    render={({ field, fieldState }) =>
                      <TextField
                        {...field}
                        label="Nome do Responsável"
                        error={!!fieldState.error}
                        helperText={fieldState.error ? fieldState.error.message : null}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ''))}
                        fullWidth
                      />
                    }
                  />
                  <Controller
                    name="telefoneResponsavelPrincipal"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Telefone é obrigatório",
                      pattern: {
                        value: /^[0-9]+$/i,
                        message: "Apenas números são permitidos"
                      }
                    }}
                    render={({ field, fieldState }) =>
                      <TextField
                        {...field}
                        label="Contato do Responsável Principal"
                        error={!!fieldState.error}
                        helperText={fieldState.error ? fieldState.error.message : null}
                        fullWidth
                      />
                    }
                  />
                  <Controller
                    name="telefoneResponsavelSecundario"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Telefone é obrigatório",
                      pattern: {
                        value: /^[0-9]+$/i,
                        message: "Apenas números são permitidos"
                      }
                    }}
                    render={({ field, fieldState }) =>
                      <TextField
                        {...field}
                        label="Contato do Responsável Secundário"
                        error={!!fieldState.error}
                        helperText={fieldState.error ? fieldState.error.message : null}
                        fullWidth
                      />
                    }
                  />
                </CampoSection>
              </InforSection>
            </CadastroSection>
            <CadastroSection>
              <CadastroSectionTitle>Documentação</CadastroSectionTitle>
              <InforSection>
                <CampoSection>
                  <Controller
                    name="cpf"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "CPF é obrigatório",
                      pattern: {
                        value: /^[0-9]+$/i,
                        message: "Apenas números são permitidos"
                      },
                      validate: (value) => validarCpf(value) || "CPF inválido"
                    }}
                    render={({ field, fieldState }) =>
                      <TextField
                        {...field}
                        label="CPF"
                        error={!!fieldState.error}
                        helperText={fieldState.error ? fieldState.error.message : null}
                        fullWidth
                      />
                    }
                  />
                  <Controller
                    name="rg"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "RG é obrigatório",
                      pattern: {
                        value: /^[0-9]+$/i,
                        message: "Apenas números são permitidos"
                      }
                    }}
                    render={({ field, fieldState }) =>
                      <TextField
                        {...field}
                        label="RG"
                        error={!!fieldState.error}
                        helperText={fieldState.error ? fieldState.error.message : null}
                        fullWidth
                      />
                    }
                  />
                  <Controller
                    name="cartaoSus"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Cartão SUS é obrigatório",
                      pattern: {
                        value: /^[0-9]+$/i,
                        message: "Apenas números são permitidos"
                      }
                    }}
                    render={({ field, fieldState }) =>
                      <TextField
                        {...field}
                        label="Cartão SUS"
                        error={!!fieldState.error}
                        helperText={fieldState.error ? fieldState.error.message : null}
                        fullWidth
                      />
                    }
                  />
                </CampoSection>
                <CampoSection>
                  <Controller
                    name="hasPlanoSaude"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      <FormControl component="fieldset" fullWidth>
                        <FormLabel component="legend">Possui plano de saúde?</FormLabel>
                        <RadioGroup
                          {...field}
                          value={field.value ? "true" : "false"}
                          onChange={(e) => setValue('hasPlanoSaude', e.target.value === 'true')}
                          row
                        >
                          <FormControlLabel value="false" control={<Radio />} label="Não" />
                          <FormControlLabel value="true" control={<Radio />} label="Sim" />
                        </RadioGroup>
                      </FormControl>
                    )}
                  />
                  {watchHasPlanoSaude && (
                    <>
                      <ControlledCampoTexto
                        name="planoSaude"
                        control={control}
                        label="Plano de Saúde"
                        rules={{ required: "Plano de Saúde é obrigatório" }}
                      />
                      <ControlledCampoNumero
                        name="matriculaPlano"
                        control={control}
                        label="Matrícula do Plano"
                        rules={{
                          required: "Matrícula do Plano é obrigatória"
                        }}
                      />
                      <ControlledFieldData
                        name="validadePlano"
                        control={control}
                        label="Validade do Plano"
                        rules={{ required: "Validade do plano é obrigatória" }}
                      />
                    </>
                  )}
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
                  <ControlledSelectComplemento
                    name="complemento"
                    control={control}
                    label="Complemento"
                    rules={{ required: "Complemento é obrigatório" }}
                  />
                  <ControlledCampoTexto
                    name="cidade"
                    control={control}
                    label="Cidade/Município"
                    rules={{ required: "Cidade/Município é obrigatória" }}
                  />
                </CampoSection>
                <CampoSection>
                  <ControlledSelectPais
                    name="pais"
                    control={control}
                    label="País"
                    rules={{ required: "País é obrigatório" }}
                  />
                  <ControlledSelectUF
                    name="estado"
                    control={control}
                    label="Estado/UF"
                    rules={{ required: "Estado/UF é obrigatório" }}
                  />
                  <ControlledCampoNumero
                    name="cep"
                    control={control}
                    label="CEP"
                    rules={{
                      required: "CEP é obrigatório"
                    }}
                  />
                  <ControlledCampoTexto
                    name="referencia"
                    control={control}
                    label="Ponto de Referência"
                    rules={{}}
                  />
                </CampoSection>
              </InforSection>
            </CadastroSection>
            <CadastroButton type="submit" onClick={() => setTabValue(1)}>Próximo</CadastroButton>
            <ButtonProximo type="button" onClick={handleChange}>Próximo</ButtonProximo>
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
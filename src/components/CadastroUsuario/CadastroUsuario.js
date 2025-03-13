import React from 'react';
import { useForm } from 'react-hook-form';
import { ref, get, set, child } from 'firebase/database';
import { Tabs, Tab, Box, Typography } from '@mui/material'; // Adicione MenuItem aqui
import ControlledInput from '../ControlledInput.js';
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
} from './CadastroUsuario.styles'; // Certifique-se de que o caminho está correto
import database from '../../firebaseConfig';

const CadastroUsuario = () => {
    const { control, handleSubmit, trigger, formState: { errors }, setFocus, reset } = useForm(); // Adicione reset aqui
    const [tabValue, setTabValue] = React.useState(0);

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

        const userRef = ref(database, 'usuarios');
        const snapshot = await get(userRef);
        if (!snapshot.exists() || Object.values(snapshot.val()).every(user => user.type !== 'administrador')) {
            if (data.type !== 'administrador') {
                toast.error('Deve existir pelo menos um Administrador Master');
                return;
            }
        }

        const newUserRef = child(userRef, data.username);
        await set(newUserRef, data);

        toast.success('Usuário cadastrado com sucesso!');
        reset();
    };

    return (
        <CadastroContainer>
            <Card>
                <CadastroTitle>Cadastro de Usuário</CadastroTitle>
                <Tabs value={tabValue} onChange={handleChange} aria-label="Cadastro Tabs">
                    <Tab label="Informações de Cadastro" />
                    <Tab label="Informações Adicionais" />
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
                                        rules={{ required: "Data de Nascimento é obrigatório" }}
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
                            <CadastroSectionTitle>Informações Adicionais</CadastroSectionTitle>
                            <InforSection>
                                <CampoSection>
                                    <ControlledEmail
                                        name="email"
                                        control={control}
                                        label="E-mail"
                                        rules={{ required: "E-mail é obrigatório" }}
                                    />
                                    <ControlledInput
                                        name="username"
                                        control={control}
                                        label="Nome de Usuário"
                                        type="text"
                                        rules={{ required: "Nome de usuário é obrigatório" }}
                                    />
                                    <ControlledInput
                                        name="password"
                                        control={control}
                                        label="Senha"
                                        type="password"
                                        rules={{ required: "Senha é obrigatória" }}
                                    />
                                    <ControlledSelect
                                        name="type"
                                        control={control}
                                        label="Tipo de Usuário"
                                        type="tipoUsuario"
                                        rules={{ required: "Tipo de usuário é obrigatório" }}
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

export default CadastroUsuario
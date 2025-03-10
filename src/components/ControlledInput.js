import React from 'react';
import { Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';

// Função de validação do CPF
const validarCpf = (cpf) => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11) return "CPF deve ter 11 dígitos";
  let soma = 0;
  let resto;
  if (cpf === "00000000000") return "CPF inválido";
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return "CPF inválido";
  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return "CPF inválido";
  return true;
};

const ControlledInput = ({ name, control, label, inputType, rules, multiline, ...props }) => {
  const validarTexto = (value) => {
    return /^[A-Za-z\s]+$/i.test(value) || "Apenas letras são permitidas sem acento";
  };

  const validarNumeros = (value) => {
    if (!/^[0-9]+$/i.test(value)) {
      return "Apenas números inteiros são permitidos";
    }
    return true;
  };

  const validarDecimais = (value) => {
    if (!/^\d+(\.\d+)?$/i.test(value)) {
      return "Apenas números decimais são permitidos";
    }
    return true;
  };

  const handleChangeTexto = (event, field) => {
    const upperCaseValue = event.target.value.toUpperCase();
    field.onChange(upperCaseValue);
  };

  const handleChangeCpf = (event, field) => {
    const formattedValue = event.target.value.replace(/[^\d]/g, '');
    field.onChange(formattedValue);
  };

  const getValidation = () => {
    if (inputType === 'text') {
      return validarTexto;
    } else if (inputType === 'integer') {
      return validarNumeros;
    } else if (inputType === 'decimal') {
      return validarDecimais;
    } else if (inputType === 'cpf') {
      return validarCpf;
    }
    return undefined;
  };

  const getHandleChange = (field) => {
    if (inputType === 'text') {
      return (e) => handleChangeTexto(e, field);
    } else if (inputType === 'cpf') {
      return (e) => handleChangeCpf(e, field);
    }
    return field.onChange;
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      rules={{
        ...rules,
        validate: getValidation(),
      }}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          label={label}
          type={inputType === 'text' ? 'text' : inputType === 'cpf' ? 'text' : 'number'}
          multiline={multiline}
          error={!!fieldState.error}
          helperText={fieldState.error ? fieldState.error.message : null}
          fullWidth
          {...props}
          onChange={(e) => getHandleChange(field)(e)}
        />
      )}
    />
  );
};

export default ControlledInput;
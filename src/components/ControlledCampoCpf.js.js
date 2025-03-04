import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";

const ControlledCampoCpf = ({ name, control, label, rules, ...props }) => {
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

  const handleChange = (event, field) => {
    const formattedValue = event.target.value.replace(/[^\d]/g, '');
    field.onChange(formattedValue);
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      rules={{
        ...rules,
        validate: validarCpf,
        required: `${label} é obrigatório`
      }}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          label={label}
          error={!!fieldState.error}
          helperText={fieldState.error ? fieldState.error.message : null}
          fullWidth
          {...props}
          onChange={(e) => handleChange(e, field)}
        />
      )}
    />
  );
};

export default ControlledCampoCpf;
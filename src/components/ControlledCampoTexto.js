import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";

const ControlledCampoTexto = ({ name, control, label, rules, multiline, ...props }) => {
  const validarTexto = (value) => {
    return /^[A-Za-z\s]+$/i.test(value) || "Apenas letras são permitidas sem acento";
  }

  const handleChange = (event, field) => {
    const upperCaseValue = event.target.value.toUpperCase();
    field.onChange(upperCaseValue);
  }

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      rules={{
        ...rules,
        validate: validarTexto,
        required: `${label} é obrigatório` // Mensagem de erro personalizada
      }}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          label={label}
          multiline={multiline}
          error={!!fieldState.error}
          helperText={fieldState.error ? fieldState.error.message : null}
          fullWidth
          {...props}
          onChange={(e) => handleChange(e, field)} // Manipulador para converter em maiúsculas
        />
      )}
    />
  );
};

export default ControlledCampoTexto;
import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";

const ControlledCampoNumero = ({ name, control, label, rules, ...props }) => {
  const validarNumeros = (value) => {
    if (!/^[0-9]+$/i.test(value)) {
      return "Apenas números são permitidos";
    }
    return true;
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      rules={{ 
        ...rules, 
        validate: validarNumeros, 
        required: `${label} é obrigatório`  // Adiciona a validação de campo obrigatório
      }}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          label={label}
          error={!!fieldState.error}
          helperText={fieldState.error ? fieldState.error.message : null}
          fullWidth
          {...props}
          onChange={(e) => {
            field.onChange(e);
          }}
        />
      )}
    />
  );
};

export default ControlledCampoNumero;
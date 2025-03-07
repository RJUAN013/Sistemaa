import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";

const ControlledEmail = ({ name, control, label, ...props }) => {
  const validateEmail = (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      return `${label} é obrigatório`;
    }
    if (!emailPattern.test(value)) {
      return "E-mail inválido";
    }
    return true;
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      rules={{ validate: validateEmail }}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          label={label}
          type="email"
          error={!!fieldState.error}
          helperText={fieldState.error ? fieldState.error.message : null}
          fullWidth
          {...props}
          onChange={(e) => field.onChange(e.target.value.toUpperCase())}
        />
      )}
    />
  );
};

export default ControlledEmail;
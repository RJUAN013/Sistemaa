import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

const sexos = [
  { value: "", label: "Selecione" },
  { value: "Masculino", label: "Masculino" },
  { value: "Feminino", label: "Feminino" },
];

const ControlledCampoSexo = ({ name, control, label, rules, ...props }) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      rules={{
        ...rules,
        required: `${label} é obrigatório`
      }}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          label={label}
          select
          error={!!fieldState.error}
          helperText={fieldState.error ? fieldState.error.message : null}
          fullWidth
          {...props}
        >
          {sexos.map((sexo) => (
            <MenuItem key={sexo.value} value={sexo.value}>
              {sexo.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
};

export default ControlledCampoSexo;
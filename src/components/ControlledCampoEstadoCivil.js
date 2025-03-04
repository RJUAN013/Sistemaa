import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

const estadosCivis = [
  { value: "", label: "Selecione" },
  { value: "Solteiro", label: "Solteiro" },
  { value: "Casado", label: "Casado" },
  { value: "Viuvo", label: "Viuvo" },
  { value: "Separado", label: "Separado" },
  { value: "União Estável", label: "União Estável" },
];

const ControlledCampoEstadoCivil = ({ name, control, label, rules, ...props }) => {
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
          {estadosCivis.map((estado) => (
            <MenuItem key={estado.value} value={estado.value}>
              {estado.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
};

export default ControlledCampoEstadoCivil;
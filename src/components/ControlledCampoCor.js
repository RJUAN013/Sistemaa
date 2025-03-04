import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

const cores = [
  { value: "", label: "Selecione" },
  { value: "Branca", label: "Branca" },
  { value: "Preta", label: "Preta" },
  { value: "Parda", label: "Parda" },
  { value: "Amarela", label: "Amarela" },
  { value: "Indígena", label: "Indígena" },
];

const ControlledCampoCor = ({ name, control, label, ...props }) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      rules={{ required: `${label} é obrigatório` }}
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
          {cores.map((cor) => (
            <MenuItem key={cor.value} value={cor.value}>
              {cor.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
};

export default ControlledCampoCor;
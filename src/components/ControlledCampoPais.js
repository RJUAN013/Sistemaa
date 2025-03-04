import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

const pais = [
  { value: "", label: "Selecione" },
  { value: "Brasil", label: "Brasil" },
  { value: "Estrangeiro", label: "Estrangeiro" },
];

const ControlledCampoPais = ({ name, control, label, rules, ...props }) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      rules={rules}
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
          {pais.map((pais) => (
            <MenuItem key={pais.value} value={pais.value}>
              {pais.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
};

export default ControlledCampoPais;
import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

const estados = [
  { value: "", label: "Selecione" },
  { value: "Pernambuco", label: "PE" },
  { value: "Acre", label: "AC" },
  { value: "Alagoas", label: "AL" },
  { value: "Amapá", label: "AP" },
  { value: "Amazonas", label: "AM" },
  { value: "Bahia", label: "BA" },
  { value: "Ceará", label: "CE" },
  { value: "Distrito Federal", label: "DF" },
  { value: "Espírito Santo", label: "ES" },
  { value: "Goiás", label: "GO" },
  { value: "Maranhão", label: "MA" },
  { value: "Mato Grosso", label: "MT" },
  { value: "Mato Grosso do Sul", label: "MS" },
  { value: "Minas Gerais", label: "MG" },
  { value: "Pará", label: "PA" },
  { value: "Paraíba", label: "PB" },
  { value: "Paraná", label: "PR" },
  { value: "Piauí", label: "PI" },
  { value: "Rio de Janeiro", label: "RJ" },
  { value: "Rio Grande do Norte", label: "RN" },
  { value: "Rio Grande do Sul", label: "RS" },
  { value: "Rondônia", label: "RO" },
  { value: "Roraima", label: "RR" },
  { value: "Santa Catarina", label: "SC" },
  { value: "São Paulo", label: "SP" },
  { value: "Sergipe", label: "SE" },
  { value: "Tocantins", label: "TO" },
  { value: "Estrangeiro", label: "EST" },
];

const ControlledCampoUF = ({ name, control, label, rules, ...props }) => {
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
          {estados.map((estado) => (
            <MenuItem key={estado.value} value={estado.value}>
              {estado.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
};

export default ControlledCampoUF;
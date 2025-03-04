import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

const complemento = [
    { value: "", label: "Selecione" },
    { value: "Apartamento", label: "Apartamento" },
    { value: "Bloco", label: "Bloco" },
    { value: "Casa", label: "Casa" },
    { value: "Fundos", label: "Fundos" },
    { value: "Sobrado", label: "Sobrado" },
    { value: "Galpão", label: "Galpão" },
    { value: "Sala", label: "Sala" },
    { value: "Andar", label: "Andar" },
    { value: "Conjunto", label: "Conjunto" },
    { value: "Loja", label: "Loja" },
    { value: "Quadra", label: "Quadra" },
    { value: "Lote", label: "Lote" },
    { value: "Anexo", label: "Anexo" },
    { value: "Esquina", label: "Esquina" },
];

const ControlledCampoComplemento = ({ name, control, label, rules, ...props }) => {
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
                    {complemento.map((complemento) => (
                        <MenuItem key={complemento.value} value={complemento.value}>
                            {complemento.label}
                        </MenuItem>
                    ))}
                </TextField>
            )}
        />
    );
};

export default ControlledCampoComplemento;
import React from 'react';
import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

const ControlledSelect = ({ name, control, label, type, rules, ...props }) => {
  const options = {
    cor: [
      { value: "", label: "Selecione" },
      { value: "Branca", label: "Branca" },
      { value: "Preta", label: "Preta" },
      { value: "Parda", label: "Parda" },
      { value: "Amarela", label: "Amarela" },
      { value: "Indígena", label: "Indígena" },
    ],
    complemento: [
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
    ],
    estadoCivil: [
      { value: "", label: "Selecione" },
      { value: "Solteiro", label: "Solteiro" },
      { value: "Casado", label: "Casado" },
      { value: "Viuvo", label: "Viuvo" },
      { value: "Separado", label: "Separado" },
      { value: "União Estável", label: "União Estável" },
    ],
    pais: [
      { value: "", label: "Selecione" },
      { value: "Brasil", label: "Brasil" },
      { value: "Estrangeiro", label: "Estrangeiro" },
    ],
    sexo: [
      { value: "", label: "Selecione" },
      { value: "Masculino", label: "Masculino" },
      { value: "Feminino", label: "Feminino" },
    ],
    estado: [
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
    ],
    tipoUsuario: [
      { value: "", label: "Selecione" },
      {value: "administrador", label: "Administrador"},
      {value: "usuario", label: "Usuário"},
    ]
  };

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
          {(options[type] || []).map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
};

export default ControlledSelect;
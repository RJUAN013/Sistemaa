import React from 'react';
import { Controller } from 'react-hook-form';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import ControlledCampoTexto from './ControlledCampoTexto';
import ControlledCampoNumero from './ControlledCampoNumero';
import ControlledCampoData from './ControlledCampoData';

const ControlledPlanoSaude = ({ control, setValue, watch }) => {
  const watchHasPlanoSaude = watch("hasPlanoSaude", false);

  return (
    <>
      <Controller
        name="hasPlanoSaude"
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend">Possui plano de saúde?</FormLabel>
            <RadioGroup
              {...field}
              value={field.value ? "true" : "false"}
              onChange={(e) => setValue('hasPlanoSaude', e.target.value === 'true')}
              row
            >
              <FormControlLabel value="false" control={<Radio />} label="Não" />
              <FormControlLabel value="true" control={<Radio />} label="Sim" />
            </RadioGroup>
          </FormControl>
        )}
      />
      {watchHasPlanoSaude && (
        <>
          <ControlledCampoTexto
            name="planoSaude"
            control={control}
            label="Plano de Saúde"
            rules={{ required: "Plano de Saúde é obrigatório" }}
          />
          <ControlledCampoNumero
            name="matriculaPlano"
            control={control}
            label="Matrícula do Plano"
            rules={{ required: "Matrícula do Plano é obrigatória" }}
          />
          <ControlledCampoData
            name="validadePlano"
            control={control}
            label="Validade do Plano"
            rules={{}}
          />
        </>
      )}
    </>
  );
};

export default ControlledPlanoSaude;
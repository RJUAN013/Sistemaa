import React from 'react';
import { Controller } from 'react-hook-form';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import ControlledInput from './ControlledInput';
import ControlledCampoDate from './ControlledDate';

const ControlledRadio = ({ control, setValue, watch, inputType }) => {
  const watchHasPlanoSaude = watch("hasPlanoSaude", false);
  const watchHasResponsavel = watch("hasResponsavel", false);

  return (
    <>
      {inputType === 'planoSaude' && (
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
              <ControlledInput
                name="planoSaude"
                control={control}
                label="Plano de Saúde"
                inputType="text"
                rules={{ required: "Plano de Saúde é obrigatório" }}
              />
              <ControlledInput
                name="matriculaPlano"
                control={control}
                label="Matrícula do Plano"
                inputType="integer"
                rules={{ required: "Matrícula do Plano é obrigatória" }}
              />
              <ControlledCampoDate
                name="validadePlano"
                control={control}
                label="Validade do Plano"
                rules={{}}
              />
            </>
          )}
        </>
      )}

      {inputType === 'responsavel' && (
        <>
          <Controller
            name="hasResponsavel"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">Menor de idade?</FormLabel>
                <RadioGroup
                  {...field}
                  value={field.value ? "true" : "false"}
                  onChange={(e) => setValue('hasResponsavel', e.target.value === 'true')}
                  row
                >
                  <FormControlLabel value="false" control={<Radio />} label="Não" />
                  <FormControlLabel value="true" control={<Radio />} label="Sim" />
                </RadioGroup>
              </FormControl>
            )}
          />
          {watchHasResponsavel && (
            <>
              <ControlledInput
                name="nomeResponsavel"
                control={control}
                label="Nome do Responsável"
                inputType="text"
                rules={{ required: "Nome do Responsável é obrigatório" }}
              />
              <ControlledInput
                name="telefoneResponsavelPrincipal"
                control={control}
                label="Contato do Responsável Principal"
                inputType="integer"
                rules={{ required: "Telefone do Responsável é obrigatório" }}
              />
              <ControlledInput
                name="telefoneResponsavelSecundario"
                control={control}
                label="Contato do Responsável Secundário"
                inputType="integer"
                rules={{}}
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default ControlledRadio;
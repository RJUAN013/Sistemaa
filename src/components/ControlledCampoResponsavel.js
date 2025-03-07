import React from 'react';
import { Controller } from 'react-hook-form';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import ControlledInput from './ControlledInput';

const ControlledResponsavel = ({ control, setValue, watch }) => {
    const watchHasResponsavel = watch("hasResponsavel", false);

    return (
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
                        rules={{ required: "Nome do Responsá é obrigatório" }}
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
    );
};

export default ControlledResponsavel;
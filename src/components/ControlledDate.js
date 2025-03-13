import React from 'react';
import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";

const ControlledDate = ({ name, control, label, rules, ...props }) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      rules={{
        ...rules
      }}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          label={label}
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          error={!!fieldState.error}
          helperText={fieldState.error ? fieldState.error.message : null}
          fullWidth
          {...props}
        />
      )}
    />
  );
};

export default ControlledDate;
'use client';

import { Autocomplete, TextField } from '@mui/material';

// Centralized gender options
export const genderOptions = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' },
];

export default function GenderAutocomplete({
  value,
  setValue,
  is_cancelled,        // 0 or 1
  required = true,
  size = 'small',
}) {
  const isDisabled = is_cancelled === 1;

  return (
    <Autocomplete
      options={genderOptions}
      disabled={isDisabled}
      getOptionLabel={(option) => option.label}
      value={genderOptions.find((g) => g.value === value) || null}
      isOptionEqualToValue={(option, value) =>
        option.value === value.value
      }
      onChange={(event, newValue) => {
        setValue(newValue ? newValue.value : '');
      }}
      sx={{
        '& .MuiSvgIcon-root': {
          color: 'white',
        },

        // disabled dropdown icon
        '&.Mui-disabled .MuiSvgIcon-root': {
          color: 'white',
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Gender"
          placeholder="Type or select gender"
          size={size}
          required={required}
          sx={{
            // normal text
            '& .MuiInputBase-input': {
              color: 'white',
            },

            // disabled text
            '& .MuiInputBase-input.Mui-disabled': {
              color: 'white',
              WebkitTextFillColor: 'white', // IMPORTANT for Chrome
            },

            // label
            '& .MuiInputLabel-root': {
              color: 'white',
            },
            '& .MuiInputLabel-root.Mui-disabled': {
              color: 'white',
            },

            // border
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'white',
              },
              '&:hover fieldset': {
                borderColor: 'white',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white',
              },

              // disabled border
              '&.Mui-disabled fieldset': {
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
              },
            },
          }}
        />
      )}
    />
  );
}

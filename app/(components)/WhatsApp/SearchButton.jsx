'use client'
import { useState, useRef } from "react";
import { SearchOutlined, Close } from "@mui/icons-material";
import { InputAdornment, TextField, IconButton } from "@mui/material";

const SearchButton = ({ value, onChange, onClear, placeholder = "Search or start a new chat" }) => {
  const [internalValue, setInternalValue] = useState("");
  const [focused, setFocused] = useState(false);

  const inputRef = useRef(null);
  const isControlled = typeof value === "string";
  const currentValue = isControlled ? value : internalValue;

  const handleValueChange = (nextValue) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
  };

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue("");
    }
    onClear?.();
    onChange?.("");
    setFocused(false);
    inputRef.current?.blur();   // 👈 remove focus
  };

  return (
    <TextField
      inputRef={inputRef}   // 👈 attach ref
      value={currentValue}
      onChange={(e) => handleValueChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholder={placeholder}
      id="outlined-start-adornment"
      fullWidth
      sx={{
        m: 1,
        '& .MuiOutlinedInput-root': {
          borderRadius: '26px',
          backgroundColor: '#2e2f2f',

          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'none',
          },

          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2ecc71',
          },
        },

        '& .MuiInputBase-input::placeholder': {
          color: '#cfcfcf',
          opacity: 0.8,
          fontSize: 15
        },

        '& .MuiInputBase-input': {
          color: '#ffffff',
          paddingTop: '15px',     // ↓ reduce height
          paddingBottom: '15px',  // ↓ reduce height
        },
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlined sx={{ color: '#abacac' }} />
            </InputAdornment>
          ),
          endAdornment: (
            focused && currentValue && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleClear}
                  sx={{ color: '#cfcfcf' }}
                >
                  <Close />
                </IconButton>
              </InputAdornment>
            )
          )
        },
      }}
    />
  );
};

export default SearchButton;

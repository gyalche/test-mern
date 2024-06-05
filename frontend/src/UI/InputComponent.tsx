import { IconButton, InputAdornment, TextField } from '@mui/material';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useState } from 'react';
interface inputTypes {
  required?: boolean;
  label?: string;
  getFieldPropsValue?: string;
  type?: string;
  autoFocus?: boolean;
  errors?: any;
  touched?: any;
  getFieldProps?: any;
}
export const InputComponent = ({
  required,
  label,
  getFieldPropsValue,
  type,
  autoFocus,
  errors,
  touched,
  getFieldProps,
}: inputTypes) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <TextField
      margin="normal"
      required={required}
      fullWidth
      size="small"
      type={showPassword ? 'text' : type}
      label={label}
      autoFocus={autoFocus}
      {...getFieldProps(getFieldPropsValue)}
      error={Boolean(touched && errors)}
      helperText={Boolean(touched && errors) && String(touched && errors)}
      InputProps={{
        endAdornment:
          type === 'password' ? (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </InputAdornment>
          ) : (
            <></>
          ),
      }}
    />
  );
};

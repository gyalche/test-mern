import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

type selectComponent = {
  value: string;
  data: string[];
  setValue: any;
  label?: string;
  width?: number;
};
const SelectComponent = ({
  value,
  setValue,
  data,
  label,
  width,
}: selectComponent) => {
  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value as string);
  };
  return (
    <Box>
      <FormControl size="small" sx={{ minWidth: width ? '100%' : '110px' }}>
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label="Priority"
          onChange={handleChange}
        >
          {data.map((data) => (
            <MenuItem value={data}>{data}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SelectComponent;

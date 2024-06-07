import { useState } from 'react';

export const useFileReader = () => {
  const [file, setFile] = useState(null);
  const readFile = (value: any) => {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      setFile(event.target.result);
    };
    if (value) {
      reader.readAsDataURL(value);
    }
  };

  return { file, readFile };
};

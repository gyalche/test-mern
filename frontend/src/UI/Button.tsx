import Button from '@mui/material/Button';

interface MyButtonProps {
  type?: 'button' | 'submit' | 'reset';
  text: string;
  isLoading?: boolean;
  variant?: 'text' | 'outlined' | 'contained';
}

const MyButton = ({ type, text, isLoading, variant }: MyButtonProps) => {
  return (
    <Button
      type={type}
      fullWidth
      variant={variant}
      sx={{ mt: 3, mb: 2 }}
      disabled={isLoading ? true : false}
    >
      {text}
    </Button>
  );
};

export default MyButton;

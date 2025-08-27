import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#3f51b5' },
    secondary: { main: '#ff4081' },
    background: { default: '#f5f5f5' },
    success: { main: '#4caf50' },
    warning: { main: '#ffeb3b' },
    error: { main: '#f44336' },
  }
});

export default theme;

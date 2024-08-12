import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Dark green
      contrastText: '#fff',
    },
    secondary: {
      main: '#dc004e', // Red
      contrastText: '#fff',
    },
    neutral: {
      main: '#CFCFCF',
    },
    danger: {
      main: '#fc4a4a',
    },
    background: {
      default: '#f5f5f5',
    },
    text: {
      primary: '#000000',
      secondary: '#555555',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Avoid all-uppercase buttons
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#2e7d32',
        },
      },
    },
  },
});

export default theme;

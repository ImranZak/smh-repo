import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#388e3c', // Green color
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f4511e', // Orange color
      contrastText: '#ffffff',
    },
    neutral: {
      main: '#CFCFCF',
    },
    danger: {
      main: '#fc4a4a',
    },
    background: {
      default: '#f5f5f5', // Light grey background
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
          backgroundColor: '#388e3c', // Ensure the AppBar has a consistent background
        },
      },
    },
  },
});

export default theme;

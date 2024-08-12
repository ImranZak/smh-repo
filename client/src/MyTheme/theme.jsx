import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Dark green color
      contrastText: '#fff', // Ensure contrast text is defined
    },
    secondary: {
      main: '#dc004e', // Red color
      contrastText: '#fff',
    },
    neutral: {
      main: '#CFCFCF',
    },
    danger: {
      main: '#fc4a4a',
    },
    background: {
      default: '#f5f5f5', // Ensure background is defined
    },
    text: {
      primary: '#000', // Ensure text colors are defined
      secondary: '#555',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Disable uppercase text
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

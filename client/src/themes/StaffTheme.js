import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a4331', // Dark green for staff
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#fc4a4a', // Red for secondary actions
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
          backgroundColor: '#1a4331', // Dark green AppBar for staff
        },
      },
    },
  },
});

export default theme;

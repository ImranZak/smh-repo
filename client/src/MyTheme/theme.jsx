// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
        main: '#2e7d32',
      },
    neutral: {
      main: '#CFCFCF',
    },
    danger: {
      main: "#fc4a4a"
    }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#2e7d32', // Dark green background color
        },
      },
    },
  },
});

export default theme;

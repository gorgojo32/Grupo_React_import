// Archivo de tema (theme.js) para MUI

import { createTheme } from '@mui/material/styles';

const cafeteriaTheme = createTheme({
  palette: {
    primary: {
      main: '#5D4037', // Café medio-oscuro
      light: '#8B6B61',
      dark: '#321911',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#33691E', // Verde medio-oscuro
      light: '#5E9732',
      dark: '#003D00',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F5F5F5', // Fondo gris muy claro
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
    // Colores complementarios personalizados
    custom: {
      lightBrown: '#D7CCC8', // Café muy claro
      mediumBrown: '#A1887F', // Café medio
      lightGreen: '#DCEDC8', // Verde claro
      accentGreen: '#558B2F', // Verde acento
      warmBeige: '#EFEBE9', // Beige cálido
      darkBrown: '#3E2723', // Café oscuro para acentos
      coffeeBean: '#4E342E', // Color grano de café
      oliveGreen: '#7CB342', // Verde oliva
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    button: {
      textTransform: 'none', // Evita que los botones sean todo mayúsculas
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8, // Bordes ligeramente redondeados
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #EFEBE9 0%, #D7CCC8 100%)',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        },
      },
    },
    // Personaliza los componentes según necesites
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 3px 6px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        },
      },
    },
  },
});

export default cafeteriaTheme;
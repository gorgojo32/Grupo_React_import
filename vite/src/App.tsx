import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import WidgetsTwoToneIcon from '@mui/icons-material/WidgetsTwoTone';
import ClassSharpIcon from '@mui/icons-material/ClassSharp';
import LocalCafeTwoToneIcon from '@mui/icons-material/LocalCafeTwoTone';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Outlet } from 'react-router';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import type { Navigation } from '@toolpad/core/AppProvider';
import StarBucks from '../public/StarBucks.png';

// Crear un tema oscuro de MUI
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00704A', // Color verde de Starbucks
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
  },
  typography: {
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  },
});

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Ítems principales',
  },
  {
    title: 'Menu',
    icon: <WidgetsTwoToneIcon/>
  },
  {
    segment: 'categoria',
    title: 'Categoria',
    icon: <ClassSharpIcon/>,
  },
  {
    segment: 'producto',
    title: 'Producto',
    icon: <LocalCafeTwoToneIcon/>,
  },
  {
    segment: 'usuario',
    title: "Usuarios",
    icon: <AccountCircleIcon/>
  },
];

const BRANDING = {
  title: 'Starbucks',
  logo: <img src={StarBucks} alt="Starbucks logo" />,
  // Si Toolpad soporta propiedades de tema específicas, podemos incluirlas aquí
  theme: {
    palette: {
      mode: 'dark',
    }
  }
};

export default function App() {
  return (
    // Envolvemos la aplicación con ThemeProvider de MUI
    <ThemeProvider theme={darkTheme}>
      <CssBaseline /> {/* Reset CSS y aplica estilos base de MUI */}
      <ReactRouterAppProvider 
        navigation={NAVIGATION} 
        branding={BRANDING}
      >
        <Outlet />
      </ReactRouterAppProvider>
    </ThemeProvider>
  );
}
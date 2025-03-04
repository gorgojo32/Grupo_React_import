import * as React from 'react';
import WidgetsTwoToneIcon from '@mui/icons-material/WidgetsTwoTone';
import ClassSharpIcon from '@mui/icons-material/ClassSharp';
import LocalCafeTwoToneIcon from '@mui/icons-material/LocalCafeTwoTone';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Outlet } from 'react-router';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import type { Navigation } from '@toolpad/core/AppProvider';
import StarBucks from '../public/StarBucks.png';

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
};

export default function App() {
  return (
    <ReactRouterAppProvider navigation={NAVIGATION} branding={BRANDING}>
      <Outlet />
    </ReactRouterAppProvider>
  );
}

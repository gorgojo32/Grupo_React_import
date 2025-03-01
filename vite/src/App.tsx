import * as React from 'react';
import WidgetsTwoToneIcon from '@mui/icons-material/WidgetsTwoTone';
import ClassSharpIcon from '@mui/icons-material/ClassSharp';
import LocalCafeTwoToneIcon from '@mui/icons-material/LocalCafeTwoTone';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Outlet } from 'react-router';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import type { Navigation } from '@toolpad/core/AppProvider';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    title: 'menu',
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
    title: 'usuario',
    icon: <AccountCircleIcon/>
  },
];

const BRANDING = {
  title: 'My Toolpad Core App',
};

export default function App() {
  return (
    <ReactRouterAppProvider navigation={NAVIGATION} branding={BRANDING}>
      <Outlet />
    </ReactRouterAppProvider>
  );
}

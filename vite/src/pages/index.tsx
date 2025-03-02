import * as React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Menus from '../components/Menus';

export default function DashboardPage() {
  return (
    <Container>
      <Box sx={{ my: 3 }}>
        <Typography variant="h4" sx={{ 
          mb: 3, 
          color: '#006241',
          fontWeight: 'bold' 
        }}>
          ¡Bienvenido a StarBucks!
        </Typography>
        
        
        <Menus/>
      </Box>
    </Container>
  );
}

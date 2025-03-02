import React from 'react';
import { Typography, Paper, Box, Card, CardContent, Grid } from "@mui/material";
import CoffeeIcon from '@mui/icons-material/Coffee';

/**
 * Componente que muestra el contenido de la Opción 1
 * @param {object} data - Datos recibidos del middleware
 * @returns {JSX.Element} - Contenido de la primera opción
 */
const MenuOptionOne = ({ data = {} }) => {
  // Usar los datos recibidos o valores predeterminados
  const { title = "Productos Destacados", items = [] } = data;
  
  // Productos de ejemplo si no se proporcionan datos
  const defaultItems = [
    { id: 1, name: "Café Colombiano", description: "Café de origen único con notas de chocolate y caramelo", price: "$3.50" },
    { id: 2, name: "Frappuccino", description: "Bebida helada con base de café y crema batida", price: "$4.75" },
    { id: 3, name: "Latte Caramelo", description: "Espresso con leche al vapor y jarabe de caramelo", price: "$4.25" },
  ];
  
  const displayItems = items.length > 0 ? items : defaultItems;

  return (
    <Box>
      <Typography variant="h5" gutterBottom color="primary" sx={{ mb: 3 }}>
        {title}
      </Typography>
      
      <Grid container spacing={3}>
        {displayItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card raised sx={{ 
              height: '100%',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 6
              }
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <CoffeeIcon sx={{ mr: 1, color: '#006241' }} />
                  <Typography variant="h6">{item.name}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {item.description}
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {item.price}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MenuOptionOne;
import React from 'react';
import { Typography, Box, Card, CardContent, Grid, Divider, Avatar } from "@mui/material";
import StoreIcon from '@mui/icons-material/Store';

/**
 * Componente que muestra el contenido de la Opción 2
 * @param {object} data - Datos recibidos del middleware
 * @returns {JSX.Element} - Contenido de la segunda opción
 */
const MenuOptionTwo = ({ data = {} }) => {
  // Usar los datos recibidos o valores predeterminados
  const { title = "Nuestras Tiendas", locations = [] } = data;
  
  // Ubicaciones de ejemplo si no se proporcionan datos
  const defaultLocations = [
    { 
      id: 1, 
      name: "Starbucks Centro Comercial", 
      address: "Calle Principal #123", 
      hours: "Lun-Dom: 8:00 AM - 10:00 PM",
      features: ["WiFi Gratis", "Drive-thru", "Terraza"] 
    },
    { 
      id: 2, 
      name: "Starbucks Plaza Mayor", 
      address: "Av. Central #456", 
      hours: "Lun-Vie: 7:00 AM - 9:00 PM, Sáb-Dom: 8:00 AM - 10:00 PM",
      features: ["WiFi Gratis", "Sala de reuniones", "Estacionamiento"] 
    },
    { 
      id: 3, 
      name: "Starbucks Zona Norte", 
      address: "Blvd. Norte #789", 
      hours: "Lun-Dom: 7:30 AM - 11:00 PM",
      features: ["WiFi Gratis", "Autoservicio", "Área de juegos"] 
    },
  ];
  
  const displayLocations = locations.length > 0 ? locations : defaultLocations;

  return (
    <Box>
      <Typography variant="h5" gutterBottom color="primary" sx={{ mb: 3 }}>
        {title}
      </Typography>
      
      <Grid container spacing={3}>
        {displayLocations.map((location: { id: React.Key | null | undefined; name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; address: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; hours: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; features: any[]; }) => (
          <Grid item xs={12} key={location.id}>
            <Card sx={{ 
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: 6
              }
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: '#006241', mr: 2 }}>
                    <StoreIcon />
                  </Avatar>
                  <Typography variant="h6">{location.name}</Typography>
                </Box>
                
                <Typography variant="body1" paragraph>
                  {location.address}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  <strong>Horario:</strong> {location.hours}
                </Typography>
                
                <Divider sx={{ my: 1 }} />
                
                <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
                  {location.features.map((feature, index) => (
                    <Box 
                      key={index}
                      sx={{ 
                        bgcolor: '#f0f0f0', 
                        px: 1.5, 
                        py: 0.5, 
                        borderRadius: 1,
                        fontSize: '0.8rem'
                      }}
                    >
                      {feature}
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MenuOptionTwo;
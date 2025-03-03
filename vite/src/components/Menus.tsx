import React, { useState, useEffect } from 'react';
import { Box, Typography, Stack, Paper, CircularProgress } from "@mui/material";
import MenuButton from './MenuButton';
import MenuOptionOne from './MenuCafe';
import MenuOptionTwo from './MenuNovedades';

/**
 * Componente principal del menú interactivo
 * @returns {JSX.Element} - Menú con opciones intercambiables
 */
const Menus = () => {
  const [activeSection, setActiveSection] = useState('opcion1');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
       
        const response = await fetch(`http://localhost:8000/api/menu/${activeSection}`);
        if (!response) throw new Error("Respuesta vacía del servidor");

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        
        setData({});
      } finally {
        setLoading(false);
      }
    };

   
    const timer = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(timer);
  }, [activeSection]);

  const handleSectionChange = (section: React.SetStateAction<string>) => {

    
    fetch('http://localhost:8000/api/middleware/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'changeSection', section })
    }).catch(error => console.error("Error al comunicarse con middleware:", error));
    
    setActiveSection(section);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" p={5}>
          <CircularProgress color="primary" />
        </Box>
      );
    }

    switch (activeSection) {
      case 'opcion1':
        return <MenuOptionOne data={data} />;
      case 'opcion2':
        return <MenuOptionTwo data={data} />;
      default:
        return (
          <Typography>Selecciona una opción del menú</Typography>
        );
    }
  };

  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom sx={{ 
        color: '#006241',
        fontWeight: 'bold',
        mb: 2 
      }}>
       Información
      </Typography>
      
      <Paper elevation={1} sx={{ 
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          bgcolor: '#f5f5f5',
          px: 2
        }}>
          <Stack direction="row" spacing={1}>
            <MenuButton 
              label="Coffe" 
              active={activeSection === 'opcion1'} 
              onClick={() => handleSectionChange('opcion1')} 
            />
            <MenuButton 
              label="Tiendas" 
              active={activeSection === 'opcion2'} 
              onClick={() => handleSectionChange('opcion2')} 
            />
          </Stack>
        </Box>

        <Box p={3}>
          {renderContent()}
        </Box>
      </Paper>
    </Box>
  );
};

export default Menus;
import React, { JSX } from 'react';
import { Button } from "@mui/material";

/**
 * Componente de botón personalizado para el menú
 * @param {string} label - Texto del botón
 * @param {boolean} active - Si el botón está activo
 * @param {function} onClick - Función al hacer clic
 * @returns {JSX.Element} - Botón personalizado
 */
const MenuButton = ({ label, active, onClick }: string): JSX.Element => {
  return (
    <Button
      onClick={onClick}
      sx={{
        color: 'text.primary',
        position: 'relative',
        textTransform: 'none',
        padding: '10px 16px',
        fontWeight: active ? 'bold' : 'normal',
        transition: 'all 0.3s ease',
        '&:hover': {
          backgroundColor: 'transparent',
          color: '#006241',
          transform: 'translateY(-2px)',
          '&::after': {
            width: '100%',
          },
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: active ? '100%' : '0%',
          height: '3px',
          backgroundColor: '#006241', 
          transition: 'width 0.3s ease-in-out',
          borderRadius: '3px 3px 0 0',
        },
      }}
    >
      {label}
    </Button>
  );
};

export default MenuButton;
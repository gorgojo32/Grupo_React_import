import React from 'react';

const BusinessCard = () => {
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '400px',
      margin: '0 auto',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    }}>
      
      <div style={{
        backgroundColor: '#1a365d',
        padding: '16px',
        color: 'white',
        textAlign: 'center'
      }}>
        <h2 style={{ margin: '0', fontSize: '24px' }}>Lic. Aguilar</h2>
        <p style={{ margin: '8px 0 0', fontSize: '16px' }}>Desarrollador web y abogado</p>
      </div>
      

      <div style={{ 
        padding: '16px', 
        display: 'flex', 
        backgroundColor: 'white' // Fondo blanco agregado aquí
      }}>
       
        <div style={{ 
          marginRight: '16px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center'
        }}>
          <img 
            src="../../public/licAguilar.jpg" 
            alt="Lic. Aguilar" 
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #1a365d'
            }}
          />
        </div>
        
        {/* Text Column */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ marginRight: '8px', width: '24px', textAlign: 'center' }}>
              ✉️
            </div>
            <span>licenciadoAguilar@ejemplo.com</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ marginRight: '8px', width: '24px', textAlign: 'center' }}>
              📍
            </div>
            <span>Calle Falsa 123, Ciudad Imaginaria</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ marginRight: '8px', width: '24px', textAlign: 'center' }}>
              📱
            </div>
            <span>(123) 456-7890</span>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div style={{ 
        marginTop: '8px', 
        textAlign: 'center', 
        borderTop: '1px solid #eee', 
        padding: '12px',
        backgroundColor: '#f8f9fa'
      }}>
        <a href="#" style={{ 
          color: '#1a365d', 
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>
          Ver CV Completo
        </a>
      </div>
    </div>
  );
};

export default BusinessCard;

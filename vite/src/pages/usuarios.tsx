import React from 'react';

export default function MiniTarjetaProfesional() {
  return (
    <div className="container mt-4">
      <h3 className="mb-3">Tarjeta Profesional</h3>
      
      <div className="card shadow-sm" style={{ width: '18rem' }}>
        <div className="d-flex justify-content-center pt-3 bg-light">
          <img 
            src="/licAguilar.jpg" 
            className="rounded-circle" 
            alt="Lic. Aguilar"
            style={{ width: '100px', height: '100px', objectFit: 'cover', border: '3px solid #fff', boxShadow: '0 0 5px rgba(0,0,0,0.2)' }}
          />
        </div>
        <div className="card-body text-center">
          <h5 className="card-title">Lic. Aguilar</h5>
          <p className="card-text mb-2 text-muted small">Desarrollador web y abogado</p>
          
          <div className="small text-start mt-3">
            <p className="mb-1"><small><strong>Edad:</strong> 129 años</small></p>
            <p className="mb-1"><small><strong>Email:</strong> licenciadoAguilar@ejemplo.com</small></p>
            <p className="mb-1"><small><strong>Dirección:</strong> Calle Falsa 123, Ciudad Imaginaria</small></p>
          </div>
          
          <div className="mt-3">
            <a href="mailto:licenciadoAguilar@ejemplo.com" className="btn btn-sm btn-primary w-100 mb-1">Contactar</a>
            <a href="#" className="btn btn-sm btn-outline-secondary w-100">Ver CV Completo</a>
          </div>
        </div>
      </div>
    </div>
  );
}
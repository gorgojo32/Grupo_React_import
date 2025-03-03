export default function Usuarios() {
    return (

        <div className="col-9">
            <div className="card" style={{ width: '18rem', margin: '20px', padding: '20px' }}>
                <img
                    src="/licAguilar.jpg"
                    className="card-img-top"
                    alt="Foto de perfil"
                />
                <div className="card-body">
                    <h5 className="card-title">Lic. Aguilar</h5>
                    <p className="card-text">
                        <strong>Edad:</strong> 129 años <br />
                        <strong>Ocupación:</strong> Desarrollador Web y Abogado<br />
                        <strong>Email:</strong> licenciadoAguilar@example.com <br />
                        <strong>Dirección:</strong> Calle Falsa 123, Ciudad Imaginaria
                    </p>
                    <a href="mailto:juan.perez@example.com" className="btn btn-primary">
                        Contactar
                    </a>
                </div>
            </div>
        </div>

    );
}
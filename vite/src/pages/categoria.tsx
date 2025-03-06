import * as React from 'react';
import { Button, Grid2, IconButton, Stack, ButtonGroup } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import DinamicTableCtga from '../components/DinamicTables/DinamicTableCtga';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ModalNuevaCategoria from '../components/Modal/mAgregarCtga';

interface Categoria {
    id_categoria?: number;
    tipoProducto: string;
    tipoDescripcion: string;
    estado: number;
    fecha_creacion: string;
}

export default function Categorias() {
    const [dataCategorias, setDataCategorias] = React.useState<Categoria[]>([]);
    const [modalAgregarOpen, setModalAgregarOpen] = React.useState(false);


// Listar Categorios

    const fetchCategorias = () => {
        fetch('http://localhost:8000/categorias')
            .then(response => response.json())
            .then(data => setDataCategorias(data.data.map((row: { id_categoria: any }) => ({ ...row, id: row.id_categoria }))))
            .catch(error => console.error('Error al obtener las Categorías:', error));
    };

    React.useEffect(() => {
        fetchCategorias();
    }, []);

    const columns: GridColDef[] = [
        { field: "id_categoria", headerName: "#", width: 70 },
        { field: "tipoProducto", headerName: "Tipo de Producto", width: 200 },
        { field: "tipoDescripcion", headerName: "Descripción", width: 300 },
        {
            field: "estado",
            headerName: "Estado",
            width: 100,
            renderCell: (params) => (params.value === "1" ? "Activo" : "Inactivo")
        },
        //{ field: "fecha_creacion", headerName: "Fecha de Creación", width: 200 },
        {
            field: "fecha_creacion",
            headerName: "Fecha de Creación",
            width: 200,
            renderCell: (params) => {
              const fecha = new Date(params.value);
              return fecha.toISOString().split("T")[0]; // Formato "YYYY-MM-DD"
            }
          }
    ];

// Editar

    const handleEdit = async (row: Categoria) => {
        console.log("Datos a enviar:", row);
        try {
            const dataToUpdate = {
                tipoProducto: row.tipoProducto, // Aceptar ambos formatos
                tipoDescripcion: row.tipoDescripcion,
                estado: Number(row.estado),
                fecha_creacion: row.fecha_creacion // Aceptar ambos formatos
            };

            console.log("Data Formateada", dataToUpdate);

            const response = await fetch(`http://localhost:8000/categorias/${row.id_categoria}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToUpdate)
            });

            const data = await response.json();

            if (data.success) {
                fetchCategorias(); // Usar la función reutilizable
                alert("Categoria actualizada correctamente");
            } else {
                alert("Error al actualizar la Categoria: " + data.msg);
            }
        } catch (error) {
            console.error("Error al editar:", error);
            alert("Error al actualizar la Categoria");
        }
    };

// Eliminar

    const handleDelete = async (id: number) => {
        console.log("Intentando eliminar usuario con ID:", id);

        const confirmarEliminar = window.confirm("¿Estás seguro de eliminar este registro?");

        if (confirmarEliminar) {
            try {
                const response = await fetch(`http://localhost:8000/categorias/${id}`, {
                    method: 'DELETE',
                });

                const data = await response.json();

                if (data.success) {
                    setDataCategorias((prevCtga) => prevCtga.filter((ctga) => ctga.id_categoria !== id));
                    alert("Categoria eliminada correctamente");
                } else {
                    alert("Error al eliminar la Categoria: " + data.msg);
                }
            } catch (error) {
                console.error("Error al eliminar:", error);
                alert("Error al eliminar la Categoria");
            }
        }
    };

// Agregar

    const handleAgregarCategoria = () => {
        setModalAgregarOpen(true);
    };

    const handleGuardarCategoria = async (nuevaCategoria: Categoria) => {
        try {
            // Adaptamos los datos al formato que espera la API
            const dataToSend = {
                tipoProducto: nuevaCategoria.tipoProducto,
                tipoDescripcion: nuevaCategoria.tipoDescripcion,
                estado: Number(nuevaCategoria.estado),
                fecha: nuevaCategoria.fecha_creacion
            };

            console.log("Enviando nueva categoría:", dataToSend);

            const response = await fetch('http://localhost:8000/categorias', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend)
            });

            const data = await response.json();

            if (data.success) {
                fetchCategorias(); // Recargar las categorías
                alert("Categoría agregada correctamente");
            } else {
                alert("Error al agregar la categoría: " + data.msg);
            }
        } catch (error) {
            console.error("Error al agregar categoría:", error);
            alert("Error al agregar la categoría");
        }
    };

    const handleCloseModal = () => {
        setModalAgregarOpen(false);
    };

    return (
        <>
            <h1>Categorías de Productos</h1>

            <Button
                variant="contained"
                color="success" // Verde
                startIcon={<AddIcon />}
                onClick={handleAgregarCategoria}
                sx={{
                    mb: 2,         // Margen inferior
                    fontSize: "0.75rem",  // Hace el texto más pequeño
                    padding: "4px 8px",  // Reduce el tamaño del botón
                    display: "flex",
                    justifyContent: "flex-end", // Alinea a la derecha en un contenedor
                    ml: "auto" // Margen izquierdo automático para empujarlo a la derecha
                }}
            >
                Agregar Categoría
            </Button>


            <Grid2 container spacing={2} marginTop={2}>
                <Grid2 size={12}>
                    <DinamicTableCtga
                        rows={dataCategorias}
                        columns={columns}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                    />
                </Grid2>
            </Grid2>

            {/* Modal para agregar nueva categoría */}
            <ModalNuevaCategoria
                open={modalAgregarOpen}
                onClose={handleCloseModal}
                onGuardar={handleGuardarCategoria}
            />
        </>
    );
}
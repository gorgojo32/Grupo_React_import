import * as React from 'react';
import { Button, Grid2, IconButton, Stack, ButtonGroup, CircularProgress } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import DinamicTable from '../components/DinamicTables/DinamicTable';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ModalAgregarProducto from '../components/Modal/mAgregarProd';

// URL base para la API y las imágenes
const API_BASE_URL = 'http://localhost:8000';
const IMAGE_BASE_URL = `${API_BASE_URL}/uploads/`; // Ajustado para usar la ruta de imágenes del servidor

interface ProductosCoffe {
    id_producto: number | null;
    id_categoria: number;
    tipoProducto?: string; // Añadido para mostrar el nombre de la categoría
    nombre: string;
    descripcion: string;
    precio: number;
    costo: number;
    stock: number;
    imagen: string;
}

export default function Producto() {
    const [dataUsers, setDataUsers] = React.useState<ProductosCoffe[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [modalAgregarOpen, setModalAgregarOpen] = React.useState<boolean>(false);
    const [categorias, setCategorias] = React.useState<any[]>([]);

    const fetchProductos = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/productos`);
            const data = await response.json();
            
            if (data.success) {
                // Mapear los datos para asegurar que tengan el formato correcto
                setDataUsers(data.data.map((row: any) => ({ 
                    ...row, 
                    id: row.id_producto,
                    // Asegurar que la imagen tenga la ruta correcta (eliminar rutas duplicadas)
                    imagen: row.imagen ? row.imagen.replace(/^\/uploads\//, '') : ''
                })));
            } else {
                console.error('Error en la respuesta del servidor:', data);
            }
        } catch (error) {
            console.error('Error al obtener los Productos: ', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategorias = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/categorias`);
            const data = await response.json();
            
            if (data.success) {
                setCategorias(data.data);
            } else {
                console.error('Error en la respuesta del servidor:', data);
            }
        } catch (error) {
            console.error('Error al obtener las categorías: ', error);
        }
    };

    React.useEffect(() => {
        fetchProductos();
        fetchCategorias();
    }, []);

    // Columnas para la tabla de productos
    const columns: GridColDef[] = [
        { field: "id_producto", headerName: "#", width: 70 },
        {
            field: "imagen",
            headerName: "Imagen",
            width: 100,
            renderCell: (params) => {
                // Construir la URL completa de la imagen
                const imageUrl = params.value ? `${IMAGE_BASE_URL}${params.value}` : null;
                
                return (
                    <img
                        src={imageUrl}
                        alt={params.row.nombre || 'Producto'}
                        style={{ width: 50, height: 50, objectFit: 'contain' }}
                        onError={(e) => {
                            // Imagen de respaldo si hay error al cargar
                            (e.target as HTMLImageElement).src = `${API_BASE_URL}/uploads/default.png`;
                        }}
                    />
                );
            }
        },
        { field: "nombre", headerName: "Nombre del Producto", width: 146 },
        { field: "descripcion", headerName: "Descripción", width: 300 },
        { field: "tipoProducto", headerName: "Categoría", width: 120 },
        { 
            field: "precio", 
            headerName: "Precio", 
            width: 100,
            valueFormatter: (params) => {
                return `$${params.value.toFixed(2)}`;
            }
        },
        { 
            field: "costo", 
            headerName: "Costo", 
            width: 100,
            valueFormatter: (params) => {
                return `$${params.value.toFixed(2)}`;
            }
        },
        { field: "stock", headerName: "Stock", width: 100 }
    ];

    // Funciones para el manejo del modal de agregar
    const handleAgregarProducto = () => {
        setModalAgregarOpen(true);
    };

    const handleCloseModalAgregar = () => {
        setModalAgregarOpen(false);
    };

    const handleGuardarNuevoProducto = async (nuevoProducto: { 
        nuevaImagen: File | null; 
        nombre: string; 
        descripcion: string; 
        precio: string; 
        costo: string; 
        stock: string; 
        id_categoria: string; 
    }) => {
        setLoading(true);
        
        try {
            // Procesar imagen si hay una nueva
            let rutaImagen = "";
            
            if (nuevoProducto.nuevaImagen) {
                const formData = new FormData();
                // Añadir el archivo usando 'file' como nombre de campo (como espera el servidor)
                formData.append('file', nuevoProducto.nuevaImagen);
                
                const imagenResponse = await fetch(`${API_BASE_URL}/upload`, {
                    method: 'POST',
                    body: formData,
                });
                
                const imagenData = await imagenResponse.json();
                
                if (imagenData.success) {
                    // Obtener la ruta de la imagen desde la respuesta
                    rutaImagen = imagenData.file.filename;
                } else {
                    alert("Error al subir la imagen: " + (imagenData.error || 'Error desconocido'));
                    setLoading(false);
                    return;
                }
            }
            
            // Preparar datos para enviar al servidor
            const productoData = {
                nombre: nuevoProducto.nombre,
                descripcion: nuevoProducto.descripcion,
                precio: parseFloat(nuevoProducto.precio),
                costo: parseFloat(nuevoProducto.costo),
                stock: parseInt(nuevoProducto.stock, 10),
                imagen: rutaImagen,
                id_categoria: parseInt(nuevoProducto.id_categoria, 10),
                estado: 1, // Por defecto activo
                fecha_creacion: new Date().toISOString() // Fecha actual
            };
            
            console.log("Enviando datos al servidor:", productoData);
            
            // Enviar petición para crear el producto
            const response = await fetch(`${API_BASE_URL}/productos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productoData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                fetchProductos(); // Refrescar la lista de productos
                alert("Producto agregado correctamente");
                handleCloseModalAgregar(); // Cerrar el modal después de agregar
            } else {
                alert("Error al agregar el producto: " + (data.msg || 'Error desconocido'));
                console.error("Respuesta del servidor:", data);
            }
        } catch (error) {
            console.error("Error al agregar producto:", error);
            alert("Error al agregar el producto: " + (error instanceof Error ? error.message : 'Error desconocido'));
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (row: any) => {
        setLoading(true);
        console.log("Datos a editar:", row);
        
        try {
            // Manejar imagen si hay una nueva
            let rutaImagen = row.imagen;
            
            if (row.nuevaImagen) {
                const formData = new FormData();
                formData.append('file', row.nuevaImagen);
                
                const imagenResponse = await fetch(`${API_BASE_URL}/upload`, {
                    method: 'POST',
                    body: formData,
                });
                
                const imagenData = await imagenResponse.json();
                
                if (imagenData.success) {
                    rutaImagen = imagenData.file.filename;
                } else {
                    alert("Error al subir la imagen: " + (imagenData.error || 'Error desconocido'));
                    setLoading(false);
                    return;
                }
            }
            
            // Preparar datos para actualizar el producto
            const dataToUpdate = {
                nombre: row.nombre,
                descripcion: row.descripcion,
                precio: parseFloat(row.precio), 
                costo: parseFloat(row.costo),   
                stock: parseInt(row.stock, 10),  
                imagen: rutaImagen,
                id_categoria: parseInt(row.id_categoria, 10),
                estado: 1, // Mantener activo
                fecha_creacion: new Date().toISOString() // Actualizar fecha de modificación
            };
            
            console.log("Datos formateados para actualización:", dataToUpdate);
            
            // Enviar petición para actualizar el producto
            const response = await fetch(`${API_BASE_URL}/productos/${row.id_producto}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToUpdate)
            });
            
            const data = await response.json();
    
            if (data.success) {
                fetchProductos(); // Refrescar la lista de productos
                alert("Producto actualizado correctamente");
            } else {
                alert("Error al actualizar el producto: " + (data.msg || 'Error desconocido'));
            }
        } catch (error) {
            console.error("Error al editar:", error);
            alert("Error al actualizar el Producto: " + (error instanceof Error ? error.message : 'Error desconocido'));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        const confirmarEliminar = window.confirm("¿Estás seguro que deseas eliminar este producto?");

        if (confirmarEliminar) {
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
                    method: 'DELETE',
                });

                const data = await response.json();

                if (data.success) {
                    // Refrescar la lista completa en lugar de solo filtrar localmente
                    fetchProductos();
                    alert("Producto eliminado correctamente");
                } else {
                    alert("Error al eliminar el Producto: " + (data.msg || 'Error desconocido'));
                }
            } catch (error) {
                console.error("Error al eliminar:", error);
                alert("Error al eliminar el Producto: " + (error instanceof Error ? error.message : 'Error desconocido'));
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <>
            <h1>Productos de StarBucks</h1>

            <Button 
                variant="contained" 
                color="primary" 
                startIcon={<AddIcon />} 
                onClick={handleAgregarProducto}
                sx={{ mb: 2 }}
                disabled={loading}
            >
                Agregar Producto
            </Button>

            {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                    <CircularProgress />
                </div>
            )}

            <Grid2 container spacing={2} marginTop={5}>
                <Grid2 size={12}>
                    <DinamicTable
                        rows={dataUsers}
                        columns={columns}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                    />
                </Grid2>
            </Grid2>

            <ModalAgregarProducto
                open={modalAgregarOpen}
                onClose={handleCloseModalAgregar}
                onGuardar={handleGuardarNuevoProducto}
                categorias={categorias}
            />
        </>
    );
}
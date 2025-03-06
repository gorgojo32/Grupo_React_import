import * as React from 'react';
import { Button, Grid2, IconButton, Stack, ButtonGroup } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import DinamicTable from '../components/DinamicTables/DinamicTable';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ModalAgregarProducto from '../components/Modal/mAgregarProd';



interface ProductosCoffe {
    id_producto: number | null;
    id_categoria: number;
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

    const fetchProductos = () => {
        setLoading(true);
        fetch('http://localhost:8000/productos')
            .then(response => response.json())
            .then(data => {
                setDataUsers(data.data.map((row: { id_producto: any }) => ({ ...row, id: row.id_producto })));
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al obtener los Productos: ', error);
                setLoading(false);
            });
    };

    const fetchCategorias = () => {
        fetch('http://localhost:8000/categorias')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setCategorias(data.data);
                }
            })
            .catch(error => {
                console.error('Error al obtener las categorías: ', error);
            });
    };

    React.useEffect(() => {
        fetchProductos();
        fetchCategorias();
    }, []);
//hola
    const columns: GridColDef[] = [
        { field: "id_producto", headerName: "#", width: 70 },
        {
            field: "imagen",
            headerName: "Imagen",
            width: 100,
            renderCell: (params) => (
                <img
                    src={`../../public/Starbucks/${params.value}`}
                    alt={params.row.nombre}
                    style={{ width: 50, height: 50, objectFit: 'contain' }}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = '../../public/Starbucks/default.png';
                    }}
                />
            )
        },
        { field: "nombre", headerName: "Nombre del Producto", width: 146 },
        { field: "descripcion", headerName: "Descripción", width: 400},
        { field: "precio", headerName: "Precio", width: 80 },
        { field: "costo", headerName: "Costo", width: 80 },
        { field: "stock", headerName: "Stock", width: 100 }
    ];

    // Funciones para el manejo del modal de agregar
    const handleAgregarProducto = () => {
        setModalAgregarOpen(true);
    };

    const handleCloseModalAgregar = () => {
        setModalAgregarOpen(false);
    };

    const handleGuardarNuevoProducto = async (nuevoProducto: { nuevaImagen: string | Blob; nombre: any; descripcion: any; precio: string; costo: string; stock: string; id_categoria: string; }) => {
        setLoading(true);
        
        try {
            // Procesar imagen si hay una nueva
            let nombreImagen = "default.png"; // Imagen por defecto
            
            if (nuevoProducto.nuevaImagen) {
                const formData = new FormData();
                formData.append('imagen', nuevoProducto.nuevaImagen);
                formData.append('directorio', 'Starbucks');
                
                const imagenResponse = await fetch('http://localhost:8000/upload', {
                    method: 'POST',
                    body: formData,
                });
                
                const imagenData = await imagenResponse.json();
                
                if (imagenData.success) {
                    nombreImagen = imagenData.fileName;
                } else {
                    alert("Error al subir la imagen: " + imagenData.msg);
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
                imagen: nombreImagen,
                id_categoria: parseInt(nuevoProducto.id_categoria, 10)
            };
            
            // Enviar petición para crear el producto
            const response = await fetch('http://localhost:8000/productos', {
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
            } else {
                alert("Error al agregar el producto: " + data.msg);
            }
        } catch (error) {
            console.error("Error al agregar producto:", error);
            alert("Error al agregar el producto");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (row: any) => {
        setLoading(true);
        console.log("Datos a enviar:", row);
        
        try {
            //Imagen
            let nombreImagen = row.imagen;
            
            if (row.nuevaImagen) {
                const formData = new FormData();
                formData.append('imagen', row.nuevaImagen);
                formData.append('directorio', 'Starbucks');
                
                const imagenResponse = await fetch('http://localhost:8000/upload', {
                    method: 'POST',
                    body: formData,
                });
                
                const imagenData = await imagenResponse.json();
                
                if (imagenData.success) {
                    nombreImagen = imagenData.fileName;
                } else {
                    alert("Error al subir la imagen: " + imagenData.msg);
                    setLoading(false);
                    return;
                }
            }
            
            // Luego actualizamos 
            const dataToUpdate = {
                nombre: row.nombre,
                descripcion: row.descripcion,
                precio: parseFloat(row.precio), 
                costo: parseFloat(row.costo),   
                stock: parseInt(row.stock, 10),  
                imagen: nombreImagen,
                id_categoria: parseInt(row.id_categoria, 10)
            };
            
            console.log("Data formateada:", dataToUpdate);
            
            const response = await fetch(`http://localhost:8000/productos/${row.id_producto}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToUpdate)
            });
            
            const data = await response.json();
    
            if (data.success) {
                fetchProductos();
                alert("Producto actualizado correctamente");
            } else {
                alert("Error al actualizar el producto: " + data.msg);
            }
        } catch (error) {
            console.error("Error al editar:", error);
            alert("Error al actualizar el Producto");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        const confirmarEliminar = window.confirm("¿Estás seguro que deseas eliminar este producto?");

        if (confirmarEliminar) {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8000/productos/${id}`, {
                    method: 'DELETE',
                });

                const data = await response.json();

                if (data.success) {
                    setDataUsers((prevUsers) => prevUsers.filter((user) => user.id_producto !== id));
                    alert("Producto eliminado correctamente");
                } else {
                    alert("Error al eliminar el Producto: " + data.msg);
                }
            } catch (error) {
                console.error("Error al eliminar:", error);
                alert("Error al eliminar el Producto");
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
            >
                Agregar Producto
            </Button>

            <Grid2 container spacing={2} marginTop={5}>
                <Grid2 size={12}>
                    <DinamicTable
                        rows={dataUsers}
                        columns={columns}
                        onDelete={handleDelete}
                        onEdit={handleEdit} />
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
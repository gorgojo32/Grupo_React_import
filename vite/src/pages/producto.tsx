import * as React from 'react';
import { Button, Grid2, IconButton, Stack, ButtonGroup } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import DinamicTable from '../components/DinamicTable';
import DeleteIcon from '@mui/icons-material/Delete';




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
    const [roles, setRoles] = React.useState<any[]>([]);





    React.useEffect(() => {

        fetch('http://localhost:8000/productos')
            .then(response => response.json())
            .then(data => setDataUsers(data.data.map((row: { id_producto: any }) => ({ ...row, id: row.id_producto }))))
            .catch(error => console.error('Error al obtener los Productos: ', error))

    }, []);


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
                />
            )
        },
        { field: "nombre", headerName: "Nombre del Producto", width: 146 },
        { field: "descripcion", headerName: "Descripcion", width: 400},
        { field: "precio", headerName: "Precio", width: 80 },
        { field: "costo", headerName: "Money", width: 80 },
        { field: "stock", headerName: "Stock", width: 100 }

    ]
    const handleEdit = async (row: ProductosCoffe) => {
        console.log("Datos a enviar:", row);
        try {
            const dataToUpdate = {
                nombres: row.nombre,
                descripcion: row.descripcion,
                precio: row.precio,
                costo: row.costo,
                stock: row.stock
            };
            console.log("Data formateada:", dataToUpdate);
            const response = await fetch(`http://localhost:8000/productos/${row.id_producto}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToUpdate)
            });
            console.log("Respuesta del servidor:", await response.clone().json());
            const data = await response.json();

            if (data.success) {

                const updatedUsers = await fetch('http://localhost:8000/productos').then(res => res.json());
                setDataUsers(updatedUsers.data.map((row: { idUsuario: any }) => ({ ...row, id: row.idUsuario })));
                alert("Producto actualizado correctamente");
            } else {
                alert("Error al actualizar el producto: " + data.msg);
            }
        } catch (error) {
            console.error("Error al editar:", error);
            alert("Error al actualizar el Producto");
        }
    }
    const handleDelete = async (id: number) => {

        const confirmarEliminar = window.confirm("¿Estás seguro que deseas eliminar?");

        if (confirmarEliminar) {
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
            }
        }
    }






    return (
        <>
            <h1>Productos de StarBucks</h1>

            <Grid2 container spacing={2} marginTop={5}>
                <Grid2 size={12}>
                    <DinamicTable
                        rows={dataUsers}
                        columns={columns}
                        onDelete={handleDelete}
                        onEdit={handleEdit} />

                </Grid2>

            </Grid2>

        </>
    )


}
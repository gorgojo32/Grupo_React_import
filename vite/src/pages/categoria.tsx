import * as React from 'react';
import { Button, Grid2, IconButton, Stack, ButtonGroup } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import DinamicTable from '../components/DinamicTable';
import DeleteIcon from '@mui/icons-material/Delete';


interface Categoria {
    id_categoria: number;
    tipoProducto: string;
    tipoDescripcion: string;
    estado: number;
    fecha_creacion: string;
}

export default function Categorias() {
    const [dataCategorias, setDataCategorias] = React.useState<Categoria[]>([]);

    React.useEffect(() => {
        fetch('http://localhost:8000/categorias')
            .then(response => response.json())
            .then(data => setDataCategorias(data.data.map((row: { id_categoria: any}) => ({ ...row, id: row.id_categoria }))))
            .catch(error => console.error('Error al obtener las Categorías:', error));
    }, []);

    const columns: GridColDef[] = [
        { field: "id_categoria", headerName: "#", width: 70 },
        { field: "tipoProducto", headerName: "Tipo de Producto", width: 200 },
        { field: "tipoDescripcion", headerName: "Descripción", width: 300 },
        {
            field: "estado",
            headerName: "Estado",
            width: 100,
            renderCell: (params) => (params.value === 1 ? "Activo" : "Inactivo")
        },

        { field: "fecha_creacion", headerName: "Fecha de Creación", width: 200 },
    ];

    const handleEdit = async (row: Categoria) => {
        console.log("Datos a enviar:", row);
        try {
            const dataToUpdate = {
                tipoProd: row.tipoProducto,
                tipoDescrip: row.tipoDescripcion,
                estado: row.estado,
                fecha: row.fecha_creacion,
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
                const updatedCategories = await fetch('http://localhost:8000/categorias').then(res => res.json());
                setDataCategorias(updatedCategories.data.map((row: any) => ({ ...row, id: row.id_categoria })));
                alert("Categoria actualizada correctamente");
            } else {
                alert("Error al actualizar la Categoria: " + data.msg);
            }
        } catch (error) {
            console.error("Error al editar:", error);
            alert("Error al actualizar la Categoria");
        }
    };

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


    return (
        <>
            <h1>Categorías de Productos</h1>
            <Grid2 container spacing={2} marginTop={5}>
                <Grid2 size={12}>
                    <DinamicTable 
                    rows={dataCategorias} 
                    columns={columns} 
                    onDelete={handleDelete} 
                    onEdit={handleEdit} />

                </Grid2>

            </Grid2>
        </>
    );
}

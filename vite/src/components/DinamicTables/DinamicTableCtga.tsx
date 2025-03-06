import * as React from 'react';
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Paper, IconButton } from "@mui/material";
import { esES } from '@mui/x-data-grid/locales';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import ModalEdicionCategoria from '../Modal/mEditarCtga';

interface DinamicTableProps {
    rows: any[];
    columns: GridColDef[];
    onDelete: (id: number) => void;
    onEdit: (row: any) => void;
}

const DinamicTableCtga: React.FC<DinamicTableProps> = ({ rows, columns, onDelete, onEdit }) => {
    const [tableRows, setTableRows] = React.useState<any[]>([]);
    
    const [modalOpen, setModalOpen] = React.useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = React.useState(null);
        
    React.useEffect(() => {
        setTableRows(rows);
    }, [rows])
    
    const handleOpenModal = (row: any) => {
        setCategoriaSeleccionada(row);
        setModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setModalOpen(false);
        setCategoriaSeleccionada(null);
    };
    
    const handleGuardarEdicion = (productoEditado: any) => {
        onEdit(productoEditado);
        handleCloseModal();
    };

    const columnasBotones = [
        ...columns, 
        {
            field: "Actions",
            headerName: "Acciones",
            width: 100,
            renderCell: (params: { row: { id_categoria: number; }; }) => (
                <div>
                    <IconButton
                        color="default"
                        onClick={() => handleOpenModal(params.row)}
                    >
                        <SettingsIcon />
                    </IconButton>
                    <IconButton
                        color="inherit"
                        onClick={() => onDelete(params.row.id_categoria)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </div>
            )
        }
    ]

    const paginationModel = { page: 0, pageSize: 8 }
    
    return (
        <>
        <Paper sx={{ height: 600, width: "100%" }} role="region" aria-label='tabla dinamica'>
            <DataGrid
                rows={tableRows}
                columns={columnasBotones}
                getRowId={(row) => row.id_categoria}
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 8, 10, 50, 100]}
                checkboxSelection
                disableRowSelectionOnClick
                sx={{ border: 0 }}
            />
        </Paper>
        <ModalEdicionCategoria
            open={modalOpen}
            onClose={handleCloseModal}
            categoria={categoriaSeleccionada}
            onGuardar={handleGuardarEdicion}
        />
        </>
    );
};

export default DinamicTableCtga;
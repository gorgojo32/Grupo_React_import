import * as React from 'react';
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Paper, IconButton } from "@mui/material";
import { esES } from '@mui/x-data-grid/locales';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import ModalEdicionCategoria from './Modal/mEditarCtga';

interface CategoriaAPI {
    id_categoria: number;
    tipoProd: string;
    tipoDescripcion: string;
    estado: number;
    fecha: string;
}



interface CategoriaUI {
    id_categoria: number;
    tipoProducto: string;
    tipoDescripcion: string;
    estado: number;
    fecha_creacion: string;
}

interface DinamicTableProps {
    rows: CategoriaAPI[];
    columns: GridColDef[];
    onDelete: (id: number) => void;
    onEdit: (categoria: CategoriaAPI) => void;
}

const DinamicTableCtga: React.FC<DinamicTableProps> = ({ rows, columns, onDelete, onEdit }) => {
    // Convert API data model to UI model for display
    const convertToUIModel = (apiData: CategoriaAPI[]): CategoriaUI[] => {
        return apiData.map(item => ({
            id_categoria: item.id_categoria,
            tipoProducto: item.tipoProd,
            tipoDescripcion: item.tipoDescripcion,
            estado: item.estado,
            fecha_creacion: item.fecha
        }));
    };

    const [tableRows, setTableRows] = React.useState<CategoriaUI[]>([]);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = React.useState<CategoriaUI | null>(null);
    
    React.useEffect(() => {
        setTableRows(convertToUIModel(rows));
    }, [rows]);
    
    const handleOpenModal = (row: CategoriaUI) => {
        setCategoriaSeleccionada(row);
        setModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setModalOpen(false);
        setCategoriaSeleccionada(null);
    };
    
    const handleGuardarEdicion = (categoriaEditada: CategoriaAPI) => {
        onEdit(categoriaEditada);
        handleCloseModal();
    };

    const columnasBotones = [
        ...columns,
        {
            field: "Actions",
            headerName: "Acciones",
            width: 100,
            renderCell: (params: { row: CategoriaUI }) => (
                <div>
                    <IconButton
                        color="primary"
                        onClick={() => handleOpenModal(params.row)}
                    >
                        <SettingsIcon />
                    </IconButton>
                    <IconButton
                        color="error"
                        onClick={() => onDelete(params.row.id_categoria)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </div>
            )
        }
    ];

    const paginationModel = { page: 0, pageSize: 8 };
    
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
import * as React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material';


interface CategoriaUI {
  id_categoria: number;
  tipoProducto: string;
  tipoDescripcion: string;
  estado: number;
  fecha_creacion: string;
}

interface CategoriaAPI {
  id_categoria?: number;
  tipoProducto: string;
  tipoDescripcion: string;
  estado: number;
  fecha_creacion: string;
}

interface ModalEdicionCategoriaProps {
  open: boolean;
  onClose: () => void;
  categoria: CategoriaUI | null;
  onGuardar: (categoriaEditada: CategoriaAPI) => void;
}

const ModalEdicionCategoria: React.FC<ModalEdicionCategoriaProps> = ({
  open,
  onClose,
  categoria,
  onGuardar
}) => {
  const [categoriaEditada, setCategoriaEditada] = React.useState<CategoriaUI>({
    id_categoria: 0,
    tipoProducto: '',
    tipoDescripcion: '',
    estado: 0,
    fecha_creacion: new Date().toISOString(),
  });

  React.useEffect(() => {
    if (categoria) {
      setCategoriaEditada(categoria);
    }
  }, [categoria]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoriaEditada({
      ...categoriaEditada,
      [e.target.name]: e.target.value,
    });
  };

  const handleGuardar = () => {
    const categoriaParaAPI: CategoriaAPI = {
      id_categoria: categoriaEditada.id_categoria,
      tipoProducto: categoriaEditada.tipoProducto,
      tipoDescripcion: categoriaEditada.tipoDescripcion,
      estado: Number(categoriaEditada.estado),
      fecha_creacion: categoriaEditada.fecha_creacion
    };

    onGuardar(categoriaParaAPI);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar Categoría</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            name="tipoProducto"
            label="Tipo de Producto"
            fullWidth
            value={categoriaEditada.tipoProducto}
            onChange={handleTextChange}
          />
          <TextField
            name="tipoDescripcion"
            label="Descripción"
            fullWidth
            multiline
            rows={2}
            value={categoriaEditada.tipoDescripcion}
            onChange={handleTextChange}
          />

          <FormControl fullWidth>
            <InputLabel shrink>Estado</InputLabel>
            <Select
              name="estado"
              value={categoriaEditada.estado}
              onChange={(e) =>
                setCategoriaEditada({
                  ...categoriaEditada,
                  estado: Number(e.target.value),
                })
              }
            >
              <MenuItem value={1}>Activo</MenuItem>
              <MenuItem value={0}>Inactivo</MenuItem>
            </Select>
          </FormControl>

        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button onClick={handleGuardar} color="success" variant="contained">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalEdicionCategoria;
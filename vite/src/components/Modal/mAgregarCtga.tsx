import * as React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material';

interface CategoriaAPI {
  tipoProducto: string;
  tipoDescripcion: string;
  estado: number;
  fecha_creacion: string;
}

interface ModalNuevaCategoriaProps {
  open: boolean;
  onClose: () => void;
  onGuardar: (nuevaCategoria: CategoriaAPI) => void;
}

const ModalNuevaCategoria: React.FC<ModalNuevaCategoriaProps> = ({
  open,
  onClose,
  onGuardar
}) => {
  const [nuevaCategoria, setNuevaCategoria] = React.useState<CategoriaAPI>({
    tipoProducto: '',
    tipoDescripcion: '',
    estado: 1, // Estado por defecto activo (1)
    fecha_creacion: new Date().toISOString(),
  });

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNuevaCategoria({
      ...nuevaCategoria,
      [e.target.name]: e.target.value,
    });
  };

  const handleGuardar = () => {
    onGuardar(nuevaCategoria);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Nueva Categoría</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            name="tipoProducto"
            label="Tipo de Producto"
            fullWidth
            value={nuevaCategoria.tipoProducto}
            onChange={handleTextChange}
          />
          <TextField
            name="tipoDescripcion"
            label="Descripción"
            fullWidth
            multiline
            rows={2}
            value={nuevaCategoria.tipoDescripcion}
            onChange={handleTextChange}
          />
          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>
            <Select
              name="estado"
              value={nuevaCategoria.estado}
              onChange={(e) =>
                setNuevaCategoria({
                  ...nuevaCategoria,
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

export default ModalNuevaCategoria;

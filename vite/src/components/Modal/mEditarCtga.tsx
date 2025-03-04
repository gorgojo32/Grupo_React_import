import * as React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box
} from '@mui/material';

interface Categoria {
  id_categoria: number;
  tipoProducto: string;
  tipoDescripcion: string;
  estado: number;
  fecha_creacion: string;
}

interface ModalEdicionCategoriaProps {
  open: boolean;
  onClose: () => void;
  categoria: Categoria | null;
  onGuardar: (categoriaEditada: Categoria) => void;
}

const ModalEdicionCategoria: React.FC<ModalEdicionCategoriaProps> = ({ open, onClose, categoria, onGuardar }) => {
  const [categoriaEditada, setCategoriaEditada] = React.useState<Categoria>({
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
    onGuardar(categoriaEditada);
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
          <TextField
            name="estado"
            label="Estado"
            type="number"
            fullWidth
            value={categoriaEditada.estado}
            onChange={handleTextChange}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">Cancelar</Button>
        <Button onClick={handleGuardar} color="primary" variant="contained">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalEdicionCategoria;

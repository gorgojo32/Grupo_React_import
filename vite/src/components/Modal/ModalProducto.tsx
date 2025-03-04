import * as React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface ModalEdicionProductoProps {
  open: boolean;
  onClose: () => void;
  producto: {
    id_producto: number | null;
    nombre: string;
    descripcion: string;
    precio: string | number;
    costo: string | number;
    stock: number;
    imagen: string | null;
    id_categoria: number;
    tipoProducto?: string;
  } | null;
  onGuardar: (productoEditado: any) => void;
}

interface ProductoEditado {
  id_producto: number | null;
  nombre: string;
  descripcion: string;
  precio: string | number;
  costo: string | number;
  stock: number;
  imagen: string | null;
  id_categoria: number;
  nuevaImagen?: File | null;
}

const ModalEdicionProducto: React.FC<ModalEdicionProductoProps> = ({ 
  open, 
  onClose, 
  producto, 
  onGuardar 
}) => {
  const [productoEditado, setProductoEditado] = React.useState<ProductoEditado>({
    id_producto: null,
    nombre: '',
    descripcion: '',
    precio: '',
    costo: '',
    stock: 0,
    imagen: null,
    id_categoria: 0,
    nuevaImagen: null
  });
  
  const [imagenPreview, setImagenPreview] = React.useState<string | null>(null);
  const [cargandoImagen, setCargandoImagen] = React.useState(false);

  React.useEffect(() => {
    if (producto) {
      setProductoEditado({
        id_producto: producto.id_producto,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        costo: producto.costo,
        stock: producto.stock,
        imagen: producto.imagen,
        id_categoria: producto.id_categoria,
        nuevaImagen: null
      });
      
      // Resetear la vista previa de la imagen
      setImagenPreview(null);
    }
  }, [producto]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductoEditado({
      ...productoEditado,
      [e.target.name]: e.target.value
    });
  };
  
  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Crear URL temporal para previsualizar la imagen
      const fileUrl = URL.createObjectURL(file);
      setImagenPreview(fileUrl);
      
      setProductoEditado({
        ...productoEditado,
        nuevaImagen: file
      });
    }
  };

  const handleGuardar = () => {
    
    onGuardar(productoEditado);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" maxWidth="md">
      <DialogTitle id="form-dialog-title">Editar Producto</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, width: '500px' }}>
          <TextField
            autoFocus
            name="nombre"
            label="Nombre del Producto"
            type="text"
            fullWidth
            value={productoEditado.nombre}
            onChange={handleTextChange}
          />
          <TextField
            name="descripcion"
            label="Descripción"
            type="text"
            fullWidth
            multiline
            rows={2}
            value={productoEditado.descripcion}
            onChange={handleTextChange}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              name="precio"
              label="Precio"
              type="number"
              fullWidth
              value={productoEditado.precio}
              onChange={handleTextChange}
              InputProps={{
                startAdornment: '$',
              }}
            />
            <TextField
              name="costo"
              label="Costo"
              type="number"
              fullWidth
              value={productoEditado.costo}
              onChange={handleTextChange}
              InputProps={{
                startAdornment: '$',
              }}
            />
          </Box>
          <TextField
            name="stock"
            label="Stock"
            type="number"
            fullWidth
            value={productoEditado.stock}
            onChange={handleTextChange}
          />
          
          
          {productoEditado.imagen && !imagenPreview && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Imagen actual:</Typography>
              <img 
                src={`../../public/Starbucks/${productoEditado.imagen}`} 
                alt={productoEditado.nombre || 'Producto'} 
                style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
              />
            </Box>
          )}
          
          {/* Previsualización de nueva imagen */}
          {imagenPreview && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Nueva imagen:</Typography>
              <img 
                src={imagenPreview} 
                alt="Vista previa" 
                style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
              />
            </Box>
          )}
          
          {/* Selector de imagen */}
          <Box sx={{ mt: 2 }}>
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              disabled={cargandoImagen}
              sx={{ mb: 1 }}
            >
              {cargandoImagen ? (
                <CircularProgress size={24} />
              ) : (
                "Seleccionar nueva imagen"
              )}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImagenChange}
              />
            </Button>
            <Typography variant="caption" color="textSecondary">
              Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 5MB
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          Cancelar
        </Button>
        <Button onClick={handleGuardar} color="primary" variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalEdicionProducto;
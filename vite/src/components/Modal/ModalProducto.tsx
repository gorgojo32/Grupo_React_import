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
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

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
  onGuardar: (productoEditado: any) => Promise<void> | void;
  categorias?: Array<{
    id_categoria: number;
    tipoProducto: React.ReactNode;
    nombre?: string;
  }>;
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
  estado?: number;
  fecha_creacion?: string;
}

interface FormErrores {
  nombre: boolean;
  precio: boolean;
  costo: boolean;
  id_categoria: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB en bytes
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

const ModalEdicionProducto: React.FC<ModalEdicionProductoProps> = ({ 
  open, 
  onClose, 
  producto, 
  onGuardar,
  categorias = []
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
    nuevaImagen: null,
    estado: 1,
    fecha_creacion: new Date().toISOString()
  });
  
  const [imagenPreview, setImagenPreview] = React.useState<string | null>(null);
  const [cargandoImagen, setCargandoImagen] = React.useState(false);
  const [guardando, setGuardando] = React.useState(false);
  const [errorImagen, setErrorImagen] = React.useState<string | null>(null);
  
  const [errores, setErrores] = React.useState<FormErrores>({
    nombre: false,
    precio: false,
    costo: false,
    id_categoria: false
  });

  // Actualizar el estado cuando cambia el producto
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
        nuevaImagen: null,
        estado: 1,
        fecha_creacion: new Date().toISOString()
      });
      
      // Resetear estados
      setImagenPreview(null);
      setErrorImagen(null);
      setErrores({
        nombre: false,
        precio: false,
        costo: false,
        id_categoria: false
      });
    }
  }, [producto]);

  // Limpiar URL objeto al desmontar
  React.useEffect(() => {
    return () => {
      if (imagenPreview) {
        URL.revokeObjectURL(imagenPreview);
      }
    };
  }, [imagenPreview]);

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name) {
      setProductoEditado(prev => ({
        ...prev,
        [name]: value
      }));

      if (errores[name as keyof FormErrores]) {
        setErrores(prev => ({
          ...prev,
          [name]: false
        }));
      }
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    
    if (name) {
      setProductoEditado(prev => ({
        ...prev,
        [name]: value
      }));

      if (errores[name as keyof FormErrores]) {
        setErrores(prev => ({
          ...prev,
          [name]: false
        }));
      }
    }
  };
  
  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setErrorImagen(null);
    
    if (!file) return;
    
    // Validar tipo de archivo (solo imágenes)
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setErrorImagen('Solo se permiten archivos de imagen (JPG, PNG, GIF)');
      return;
    }
    
    // Validar tamaño de archivo
    if (file.size > MAX_FILE_SIZE) {
      setErrorImagen(`La imagen excede el tamaño máximo de 5MB`);
      return;
    }

    setCargandoImagen(true);
    
    // Limpiar preview anterior
    if (imagenPreview) {
      URL.revokeObjectURL(imagenPreview);
    }

    try {
      const fileUrl = URL.createObjectURL(file);
      setImagenPreview(fileUrl);
      
      setProductoEditado(prev => ({
        ...prev,
        nuevaImagen: file
      }));
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
      setErrorImagen('Error al procesar la imagen');
    } finally {
      setCargandoImagen(false);
    }
  };

  const eliminarImagen = () => {
    if (imagenPreview) {
      URL.revokeObjectURL(imagenPreview);
      setImagenPreview(null);
    }
    
    setProductoEditado(prev => ({
      ...prev,
      nuevaImagen: null
    }));
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores = {
      nombre: !productoEditado.nombre.trim(),
      precio: !productoEditado.precio || parseFloat(String(productoEditado.precio)) <= 0,
      costo: !productoEditado.costo || parseFloat(String(productoEditado.costo)) < 0,
      id_categoria: !productoEditado.id_categoria
    };

    setErrores(nuevosErrores);
    return !Object.values(nuevosErrores).some(error => error);
  };

  const handleGuardar = async () => {
    if (!validarFormulario()) {
      return;
    }
    
    setGuardando(true);
    try {
      // Preparar los datos para enviar al servidor
      const productoParaGuardar = {
        ...productoEditado,
        precio: parseFloat(String(productoEditado.precio)),
        costo: parseFloat(String(productoEditado.costo)),
        stock: parseInt(String(productoEditado.stock), 10)
      };
      
      await onGuardar(productoParaGuardar);
      onClose();
    } catch (error) {
      console.error('Error al guardar el producto:', error);
    } finally {
      setGuardando(false);
    }
  };

  // Determinar la ruta correcta para la imagen actual
  const imagenActualUrl = productoEditado.imagen 
    ? productoEditado.imagen.startsWith('http') 
      ? productoEditado.imagen
      : productoEditado.imagen.startsWith('/uploads') 
        ? `http://localhost:8000${productoEditado.imagen}`
        : `/uploads/${productoEditado.imagen}`
    : '';

  return (
    <Dialog 
      open={open} 
      onClose={!guardando ? onClose : undefined} 
      aria-labelledby="form-dialog-title" 
      maxWidth="md"
      fullWidth
    >
      <DialogTitle id="form-dialog-title">Editar Producto</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, width: '100%' }}>
          <TextField
            autoFocus
            name="nombre"
            label="Nombre del Producto"
            type="text"
            fullWidth
            value={productoEditado.nombre}
            onChange={handleTextChange}
            error={errores.nombre}
            helperText={errores.nombre ? "El nombre es obligatorio" : ""}
            required
            disabled={guardando}
          />
          
          <TextField
            name="descripcion"
            label="Descripción"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={productoEditado.descripcion}
            onChange={handleTextChange}
            disabled={guardando}
          />
          
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
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
              error={errores.precio}
              helperText={errores.precio ? "Ingrese un precio válido mayor a cero" : ""}
              required
              inputProps={{ min: "0.01", step: "0.01" }}
              disabled={guardando}
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
              error={errores.costo}
              helperText={errores.costo ? "Ingrese un costo válido (mayor o igual a cero)" : ""}
              required
              inputProps={{ min: "0", step: "0.01" }}
              disabled={guardando}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              name="stock"
              label="Stock"
              type="number"
              fullWidth
              value={productoEditado.stock}
              onChange={handleTextChange}
              inputProps={{ min: "0", step: "1" }}
              disabled={guardando}
            />
            
            {categorias.length > 0 && (
              <FormControl fullWidth required error={errores.id_categoria} disabled={guardando}>
                <InputLabel id="categoria-label">Categoría</InputLabel>
                <Select
                  labelId="categoria-label"
                  name="id_categoria"
                  value={productoEditado.id_categoria}
                  onChange={(e) => {
                    handleSelectChange({
                      target: {
                        name: 'id_categoria',
                        value: e.target.value
                      }
                    } as React.ChangeEvent<{ name?: string; value: unknown }>);
                  }}
                  label="Categoría"
                >
                  {categorias.map((categoria) => (
                    <MenuItem key={categoria.id_categoria} value={categoria.id_categoria}>
                      {categoria.tipoProducto}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
          
          {/* Imagen actual */}
          {productoEditado.imagen && !imagenPreview && (
            <Box sx={{ mt: 2, border: '1px solid #eee', p: 1, borderRadius: 1 }}>
              <Typography variant="subtitle1" gutterBottom>Imagen actual:</Typography>
              <img 
                src={imagenActualUrl}
                alt={productoEditado.nombre || 'Producto'} 
                style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain', display: 'block', margin: '0 auto' }}
              />
            </Box>
          )}
          
          {/* Nueva imagen seleccionada */}
          {imagenPreview && (
            <Box sx={{ mt: 2, border: '1px solid #eee', p: 1, borderRadius: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1">Nueva imagen:</Typography>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={eliminarImagen}
                  size="small"
                  disabled={guardando}
                >
                  Quitar
                </Button>
              </Box>
              <img 
                src={imagenPreview} 
                alt="Vista previa" 
                style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain', display: 'block', margin: '0 auto' }}
              />
            </Box>
          )}
          
          {/* Selector de imagen */}
          <Box sx={{ mt: 2 }}>
            <Button
              component="label"
              variant="contained"
              startIcon={cargandoImagen ? <CircularProgress size={24} /> : <CloudUploadIcon />}
              disabled={cargandoImagen || guardando}
              sx={{ mb: 1 }}
              fullWidth
            >
              {cargandoImagen ? "Procesando..." : "Seleccionar nueva imagen"}
              <input
                type="file"
                accept={ALLOWED_IMAGE_TYPES.join(',')}
                hidden
                onChange={handleImagenChange}
                disabled={guardando}
              />
            </Button>
            
            <Typography variant="caption" color="textSecondary">
              Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 5MB
            </Typography>
            
            {errorImagen && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {errorImagen}
              </Alert>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" disabled={guardando}>
          Cancelar
        </Button>
        <Button 
          onClick={handleGuardar} 
          color="primary" 
          variant="contained"
          disabled={guardando}
          startIcon={guardando && <CircularProgress size={20} color="inherit" />}
        >
          {guardando ? "Guardando..." : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalEdicionProducto;
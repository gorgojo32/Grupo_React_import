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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

interface ModalAgregarProductoProps {
  open: boolean;
  onClose: () => void;
  onGuardar: (nuevoProducto: any) => void;
  categorias: Array<{ id_categoria: number, nombre: string }>;
  requiereImagen?: boolean;
}

interface NuevoProducto {
  nombre: string;
  descripcion: string;
  precio: string | number;
  costo: string | number;
  stock: number;
  imagen: string | null;
  id_categoria: number;
  nuevaImagen: File | null;
  estado?: number;
  fecha_creacion?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB en bytes
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

const ModalAgregarProducto: React.FC<ModalAgregarProductoProps> = ({
  open,
  onClose,
  onGuardar,
  categorias = [],
  requiereImagen = false
}) => {
  const [nuevoProducto, setNuevoProducto] = React.useState<NuevoProducto>({
    nombre: '',
    descripcion: '',
    precio: '',
    costo: '',
    stock: 0,
    imagen: null,
    id_categoria: categorias.length > 0 ? categorias[0].id_categoria : 1,
    nuevaImagen: null,
    estado: 1,
    fecha_creacion: new Date().toISOString()
  });
  
  const [imagenPreview, setImagenPreview] = React.useState<string | null>(null);
  const [cargandoImagen, setCargandoImagen] = React.useState(false);
  const [guardando, setGuardando] = React.useState(false);
  const [errorImagen, setErrorImagen] = React.useState<string | null>(null);
  
  const [errores, setErrores] = React.useState({
    nombre: false,
    precio: false,
    costo: false,
    id_categoria: false,
    imagen: false
  });

  // Resetear el estado al abrir el modal
  React.useEffect(() => {
    if (open) {
      setNuevoProducto({
        nombre: '',
        descripcion: '',
        precio: '',
        costo: '',
        stock: 0,
        imagen: null,
        id_categoria: categorias.length > 0 ? categorias[0].id_categoria : 1,
        nuevaImagen: null,
        estado: 1,
        fecha_creacion: new Date().toISOString()
      });
      setImagenPreview(null);
      setErrores({
        nombre: false,
        precio: false,
        costo: false,
        id_categoria: false,
        imagen: false
      });
      setErrorImagen(null);
    }
  }, [open, categorias]);

  // Limpiar URL objeto al desmontar
  React.useEffect(() => {
    return () => {
      if (imagenPreview) {
        URL.revokeObjectURL(imagenPreview);
      }
    };
  }, [imagenPreview]);

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> |
      React.SyntheticEvent<Element, Event>
  ) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown };
    const name = target.name;
    const value = target.value;

    if (name) {
      setNuevoProducto({
        ...nuevoProducto,
        [name]: value
      });

      if (errores[name as keyof typeof errores]) {
        setErrores({
          ...errores,
          [name]: false
        });
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
      
      setNuevoProducto({
        ...nuevoProducto,
        nuevaImagen: file
      });
      
      if (errores.imagen) {
        setErrores({
          ...errores,
          imagen: false
        });
      }
    } catch (error) {
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
    
    setNuevoProducto({
      ...nuevoProducto,
      nuevaImagen: null
    });
  };

  const validarFormulario = () => {
    const nuevosErrores = {
      nombre: !nuevoProducto.nombre.trim(),
      precio: !nuevoProducto.precio || parseFloat(String(nuevoProducto.precio)) <= 0,
      costo: !nuevoProducto.costo || parseFloat(String(nuevoProducto.costo)) < 0,
      id_categoria: !nuevoProducto.id_categoria,
      imagen: requiereImagen && !nuevoProducto.nuevaImagen
    };

    setErrores(nuevosErrores);
    return !Object.values(nuevosErrores).some(error => error);
  };

  const handleGuardar = () => {
    if (validarFormulario()) {
      setGuardando(true);
      try {
        onGuardar(nuevoProducto);
        onClose();
      } catch (error) {
        console.error('Error al guardar:', error);
      } finally {
        setGuardando(false);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" maxWidth="md">
      <DialogTitle id="form-dialog-title">Agregar Nuevo Producto</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, width: '500px' }}>
          <TextField
            autoFocus
            name="nombre"
            label="Nombre del Producto"
            type="text"
            fullWidth
            value={nuevoProducto.nombre}
            onChange={handleTextChange}
            error={errores.nombre}
            helperText={errores.nombre ? "El nombre es obligatorio" : ""}
            required
          />

          <TextField
            name="descripcion"
            label="Descripción"
            type="text"
            fullWidth
            multiline
            rows={2}
            value={nuevoProducto.descripcion}
            onChange={handleTextChange}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              name="precio"
              label="Precio"
              type="number"
              fullWidth
              value={nuevoProducto.precio}
              onChange={handleTextChange}
              InputProps={{
                startAdornment: '$',
              }}
              error={errores.precio}
              helperText={errores.precio ? "Ingrese un precio válido" : ""}
              required
              inputProps={{ min: "0.01", step: "0.01" }}
            />

            <TextField
              name="costo"
              label="Costo"
              type="number"
              fullWidth
              value={nuevoProducto.costo}
              onChange={handleTextChange}
              InputProps={{
                startAdornment: '$',
              }}
              error={errores.costo}
              helperText={errores.costo ? "Ingrese un costo válido" : ""}
              required
              inputProps={{ min: "0", step: "0.01" }}
            />
          </Box>

          <TextField
            name="stock"
            label="Stock"
            type="number"
            fullWidth
            value={nuevoProducto.stock}
            onChange={handleTextChange}
            inputProps={{ min: "0", step: "1" }}
          />

          <FormControl fullWidth required error={errores.id_categoria}>
            <InputLabel id="categoria-label">Categoría</InputLabel>
            <Select
              labelId="categoria-label"
              name="id_categoria"
              value={nuevoProducto.id_categoria}
              onChange={(e) => {
                const value = e.target.value;
                setNuevoProducto({
                  ...nuevoProducto,
                  id_categoria: value as number
                });

                if (errores.id_categoria) {
                  setErrores({
                    ...errores,
                    id_categoria: false
                  });
                }
              }}
              label="Categoría"
            >
              {categorias.length > 0 ? (
                categorias.map((categoria) => (
                  <MenuItem key={categoria.id_categoria} value={categoria.id_categoria}>
                    {categoria.nombre}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value={1}>Categoría por defecto</MenuItem>
              )}
            </Select>
            {errores.id_categoria && (
              <Typography variant="caption" color="error">
                Seleccione una categoría
              </Typography>
            )}
          </FormControl>
          
          {/* Selector de imagen */}
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1">
                Imagen del producto {requiereImagen && <span style={{ color: 'red' }}>*</span>}
              </Typography>
              
              {imagenPreview && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={eliminarImagen}
                  size="small"
                >
                  Eliminar
                </Button>
              )}
            </Box>
            
            <Button
              component="label"
              variant="contained"
              startIcon={cargandoImagen ? <CircularProgress size={24} /> : <CloudUploadIcon />}
              disabled={cargandoImagen}
              sx={{ mb: 1 }}
              fullWidth
            >
              {cargandoImagen ? "Procesando..." : "Seleccionar imagen"}
              <input
                type="file"
                accept={ALLOWED_IMAGE_TYPES.join(',')}
                hidden
                onChange={handleImagenChange}
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
            
            {errores.imagen && (
              <Typography variant="caption" color="error" display="block" sx={{ mt: 1 }}>
                La imagen es obligatoria
              </Typography>
            )}
          </Box>
          
          {/* Vista previa de la imagen seleccionada */}
          {imagenPreview && (
            <Box sx={{ mt: 2, border: '1px solid #eee', p: 1, borderRadius: 1 }}>
              <img
                src={imagenPreview}
                alt="Vista previa"
                style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain', display: 'block', margin: '0 auto' }}
              />
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          Cancelar
        </Button>
        <Button 
          onClick={handleGuardar} 
          color="primary" 
          variant="contained"
          disabled={guardando}
        >
          {guardando ? "Guardando..." : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalAgregarProducto;
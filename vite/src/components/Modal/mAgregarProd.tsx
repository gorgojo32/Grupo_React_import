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
  MenuItem
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';


interface ModalAgregarProductoProps {
  open: boolean;
  onClose: () => void;
  onGuardar: (nuevoProducto: any) => void;
  categorias: Array<{
    tipoProducto: React.ReactNode; id_categoria: number, nombre: string 
}>;
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

const ModalAgregarProducto: React.FC<ModalAgregarProductoProps> = ({
  open,
  onClose,
  onGuardar,
  categorias = []
}) => {
  const [nuevoProducto, setNuevoProducto] = React.useState<NuevoProducto>({
    nombre: '',
    descripcion: '',
    precio: '',
    costo: '',
    stock: 0,
    imagen: null,
    id_categoria: 1,
    nuevaImagen: null,
    estado: 1,
    fecha_creacion: new Date().toISOString()
  });
  const [imagenPreview, setImagenPreview] = React.useState<string | null>(null);
  const [cargandoImagen, setCargandoImagen] = React.useState(false);
  const [errores, setErrores] = React.useState({
    nombre: false,
    precio: false,
    costo: false,
    id_categoria: false,
  });



  React.useEffect(() => {
    if (open) {
      setNuevoProducto({
        nombre: '',
        descripcion: '',
        precio: '',
        costo: '',
        stock: 0,
        imagen: null,
        id_categoria: 1,
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
      });
    }
  }, [open]);



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
    if (file) {

      const fileUrl = URL.createObjectURL(file);
      setImagenPreview(fileUrl);

      setNuevoProducto({
        ...nuevoProducto,
        nuevaImagen: file
      });
    }
  };


  const validarFormulario = () => {
    const nuevosErrores = {
      nombre: !nuevoProducto.nombre.trim(),
      precio: !nuevoProducto.precio || parseFloat(String(nuevoProducto.precio)) <= 0,
      costo: !nuevoProducto.costo || parseFloat(String(nuevoProducto.costo)) < 0,
      id_categoria: !nuevoProducto.id_categoria
    };

    setErrores(nuevosErrores);


    return !Object.values(nuevosErrores).some(error => error);
  };


  const handleGuardar = () => {
    if (validarFormulario()) {
      onGuardar(nuevoProducto);
      onClose();
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
            />
          </Box>

          <TextField
            name="stock"
            label="Stock"
            type="number"
            fullWidth
            value={nuevoProducto.stock}
            onChange={handleTextChange}
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
                    {categoria.tipoProducto} 
                  </MenuItem>
                ))
              ) : (
                <MenuItem value={1}>Categoría por defecto</MenuItem>
              )}
            </Select>
          </FormControl>




          {imagenPreview && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Vista previa:</Typography>
              <img
                src={imagenPreview}
                alt="Vista previa"
                style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
              />
            </Box>
          )}

          
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
                "Seleccionar imagen"
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

export default ModalAgregarProducto;
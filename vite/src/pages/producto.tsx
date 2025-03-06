import * as React from 'react';
import { 
  Button, 
  Grid, 
  CircularProgress, 
  Typography, 
  Container, 
  Box, 
  Snackbar, 
  Alert, 
  AlertProps, 
  useTheme,
  useMediaQuery
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import DinamicTable from '../components/DinamicTables/DinamicTable';
import AddIcon from '@mui/icons-material/Add';
import ModalAgregarProducto from '../components/Modal/mAgregarProd';

// Configuración de la API
const API_BASE_URL = 'http://localhost:8000';
const IMAGE_BASE_URL = `${API_BASE_URL}/uploads/`;

// Interfaces
interface ProductosCoffe {
  id_producto: number;
  id_categoria: number;
  tipoProducto?: string;
  nombre: string;
  descripcion: string;
  precio: number;
  costo: number;
  stock: number;
  imagen: string | null;
}

interface Categoria {
  id_categoria: number;
  tipoProducto: string;
  nombre?: string;
}

interface AlertMessage {
  message: string;
  severity: AlertProps['severity'];
  open: boolean;
}

export default function Producto() {
  // Estados
  const [productos, setProductos] = React.useState<ProductosCoffe[]>([]);
  const [categorias, setCategorias] = React.useState<Categoria[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [modalAgregarOpen, setModalAgregarOpen] = React.useState<boolean>(false);
  const [alert, setAlert] = React.useState<AlertMessage>({
    message: '',
    severity: 'info',
    open: false
  });
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Función para mostrar alertas
  const showAlert = (message: string, severity: AlertProps['severity'] = 'info') => {
    setAlert({
      message,
      severity,
      open: true
    });
  };

  const handleCloseAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  // Obtener productos desde la API
  const fetchProductos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/productos`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Mapear los datos para asegurar que tengan el formato correcto
        setProductos(data.data.map((row: any) => ({ 
          ...row, 
          // Asegurar que la imagen tenga la ruta correcta
          imagen: row.imagen ? (
            row.imagen.startsWith('http') 
              ? row.imagen 
              : row.imagen.startsWith('/uploads/') 
                ? row.imagen
                : `/uploads/${row.imagen}`
          ) : null
        })));
      } else {
        showAlert(`Error al cargar productos: ${data.msg || 'Error desconocido'}`, 'error');
      }
    } catch (error) {
      console.error('Error al obtener los Productos:', error);
      showAlert(`Error al cargar productos: ${error instanceof Error ? error.message : 'Error de conexión'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Obtener categorías desde la API
  const fetchCategorias = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categorias`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setCategorias(data.data);
      } else {
        console.error('Error en la respuesta del servidor:', data);
      }
    } catch (error) {
      console.error('Error al obtener las categorías:', error);
      showAlert('Error al cargar las categorías', 'warning');
    }
  };

  // Cargar datos iniciales
  React.useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

  // Columnas para la tabla
  const columns: GridColDef[] = [
    { 
      field: "id_producto", 
      headerName: "ID", 
      width: 70,
      align: 'center',
      headerAlign: 'center' 
    },
    {
      field: "imagen",
      headerName: "Imagen",
      width: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const imageUrl = params.value 
          ? params.value.startsWith('http') 
            ? params.value 
            : params.value.startsWith('/uploads/') 
              ? `${API_BASE_URL}${params.value}`
              : `${IMAGE_BASE_URL}${params.value.replace(/^\/uploads\//, '')}`
          : null;
        
        return (
          <Box 
            sx={{ 
              width: 50, 
              height: 50, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={params.row.nombre || 'Producto'}
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '100%', 
                  objectFit: 'contain',
                  borderRadius: '4px'
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `${API_BASE_URL}/uploads/default.png`;
                }}
                loading="lazy"
              />
            ) : (
              <Box 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  bgcolor: 'grey.200', 
                  borderRadius: 1, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  N/A
                </Typography>
              </Box>
            )}
          </Box>
        );
      }
    },
    { 
      field: "nombre", 
      headerName: "Nombre", 
      width: isMobile ? 120 : 200,
      flex: 1 
    },
    { 
      field: "descripcion", 
      headerName: "Descripción", 
      width: isMobile ? 150 : 300,
      flex: 1.5,
      renderCell: (params) => (
        <div style={{ 
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
          whiteSpace: 'nowrap',
          width: '100%'
        }}>
          {params.value}
        </div>
      )
    },
    { 
      field: "tipoProducto", 
      headerName: "Categoría", 
      width: 120,
      flex: 0.8 
    },
    { 
        field: "precio", 
        headerName: "Precio", 
        width: 100,
        align: 'right',
        headerAlign: 'right',
        type: 'number',
        renderCell: (params) => {
          const valor = params.row.precio;
          if (valor == null) return '';
          return `$${Number(valor).toFixed(2)}`;
        }
      },
      { 
        field: "costo", 
        headerName: "Costo", 
        width: 100,
        align: 'right',
        headerAlign: 'right',
        type: 'number',
        renderCell: (params) => {
          const valor = params.row.costo;
          if (valor == null) return '';
          return `$${Number(valor).toFixed(2)}`;
        }
      },
    { 
      field: "stock", 
      headerName: "Stock", 
      width: 90,
      align: 'right',
      headerAlign: 'right',
      type: 'number'
    }
  ];

  // Funciones para el manejo del modal de agregar
  const handleAgregarProducto = () => {
    setModalAgregarOpen(true);
  };

  const handleCloseModalAgregar = () => {
    setModalAgregarOpen(false);
  };

  // Función para subir una imagen
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const imagenResponse = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!imagenResponse.ok) {
      throw new Error(`Error al subir imagen: ${imagenResponse.status}`);
    }
    
    const imagenData = await imagenResponse.json();
    
    if (!imagenData.success) {
      throw new Error(`Error en respuesta: ${imagenData.error || 'Error desconocido'}`);
    }
    
    return imagenData.file.path || `/uploads/${imagenData.file.filename}`;
  };

  // Guardar nuevo producto
  const handleGuardarNuevoProducto = async (nuevoProducto: any) => {
    setLoading(true);
    
    try {
      // Procesar imagen si hay una nueva
      let rutaImagen = "";
      
      if (nuevoProducto.nuevaImagen) {
        rutaImagen = await uploadImage(nuevoProducto.nuevaImagen);
      }
      
      // Preparar datos para enviar al servidor
      const productoData = {
        nombre: nuevoProducto.nombre,
        descripcion: nuevoProducto.descripcion,
        precio: parseFloat(String(nuevoProducto.precio)),
        costo: parseFloat(String(nuevoProducto.costo)),
        stock: parseInt(String(nuevoProducto.stock), 10),
        imagen: rutaImagen,
        id_categoria: parseInt(String(nuevoProducto.id_categoria), 10),
        estado: nuevoProducto.estado || 1,
        fecha_creacion: nuevoProducto.fecha_creacion || new Date().toISOString()
      };
      
      // Enviar petición para crear el producto
      const response = await fetch(`${API_BASE_URL}/productos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productoData)
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        fetchProductos(); // Refrescar la lista de productos
        showAlert("Producto agregado correctamente", "success");
        handleCloseModalAgregar();
      } else {
        showAlert(`Error: ${data.msg || 'Error desconocido'}`, "error");
      }
    } catch (error) {
      console.error("Error al agregar producto:", error);
      showAlert(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`, "error");
    } finally {
      setLoading(false);
    }
  };

  // Editar producto existente
  const handleEdit = async (producto: any) => {
    setLoading(true);
    
    try {
      // Manejar imagen si hay una nueva
      let rutaImagen = producto.imagen;
      
      if (producto.nuevaImagen) {
        rutaImagen = await uploadImage(producto.nuevaImagen);
      }
      
      // Preparar datos para actualizar el producto
      const dataToUpdate = {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: parseFloat(String(producto.precio)), 
        costo: parseFloat(String(producto.costo)),   
        stock: parseInt(String(producto.stock), 10),  
        imagen: rutaImagen,
        id_categoria: parseInt(String(producto.id_categoria), 10),
        estado: producto.estado || 1,
        fecha_creacion: producto.fecha_creacion || new Date().toISOString()
      };
      
      // Enviar petición para actualizar el producto
      const response = await fetch(`${API_BASE_URL}/productos/${producto.id_producto}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToUpdate)
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        fetchProductos(); // Refrescar la lista de productos
        showAlert("Producto actualizado correctamente", "success");
      } else {
        showAlert(`Error: ${data.msg || 'Error desconocido'}`, "error");
      }
    } catch (error) {
      console.error("Error al editar:", error);
      showAlert(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`, "error");
    } finally {
      setLoading(false);
    }
  };

  // Eliminar producto
  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        fetchProductos(); // Refrescar la lista
        showAlert("Producto eliminado correctamente", "success");
      } else {
        showAlert(`Error: ${data.msg || 'Error desconocido'}`, "error");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      showAlert(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            color: theme.palette.primary.main,
            textAlign: isMobile ? 'center' : 'left'
          }}
        >
          Administración de Productos
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: isMobile ? 'center' : 'flex-start',
          mb: 3 
        }}>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />} 
            onClick={handleAgregarProducto}
            disabled={loading}
            size={isMobile ? "small" : "medium"}
          >
            Agregar Producto
          </Button>
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress />
          </Box>
        )}

        <DinamicTable
          rows={productos}
          columns={columns}
          onDelete={handleDelete}
          onEdit={handleEdit}
          categorias={categorias}
          title="Catálogo de Productos"
        />
      </Box>

      <ModalAgregarProducto
        open={modalAgregarOpen}
        onClose={handleCloseModalAgregar}
        onGuardar={handleGuardarNuevoProducto}
        categorias={categorias}
        requiereImagen={false}
      />

      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alert.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
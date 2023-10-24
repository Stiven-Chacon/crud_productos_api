import {useEffect, useState} from 'react';
import axios from 'axios';
//de todo el archivo FuncionAlert solamente ocupamos y llamamos a show_alet
import {show_alet} from '../FuncionAlert';
import { Await } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';


const ShowProducts = () => {
    //Url de la Api
    const url='http://localhost/api/productsController.php';
    //Declaramos todos los Hooks
    const[productos, setProductos] =useState([]);//Trae todos los Productos que esten en la base de datos
    //Las columnas de la tabla productos
    const[id, setId] =useState(''); // id del producto
    const[nombre, setNombre] =useState(''); // nombre del producto
    const[descripcion, setDescripcion] =useState(''); // descripcion del producto
    const[precio, setPrecio] =useState(''); // precio del producto
    //Tipo de operacion a realizar "CRUD"
    const[opereacion, setOpereacion] =useState(1);
    //Tipo del MODAL
    const[titulo, setTitulo] =useState('');

    //Metodo para cuando reenderice la pagina tragia todos los productos
    useEffect(() =>{
        getProductos();
    },[]);
    //Hace una peticion mediante AXIOS 
    const getProductos = async () =>{
      const respuesta = await axios.get(url);
      setProductos(respuesta.data);
    }
    //Realizamos las Funciones de eliminar y editar
    const openModal = (op,id,nombre,descripcion,precio) =>{
      setId('');
      setNombre('');
      setDescripcion('');
      setPrecio(''); 
      setOpereacion(op);
      if (op === 1) {
        setTitulo('Registrar Productos');
      }
      else if (op === 2) {
        setTitulo('Editar Productos');
        setId(id);
        setNombre(nombre);
        setDescripcion(descripcion);
        setPrecio(precio); 
      }
      window.setTimeout(function(){
        document.getElementById('nombre').focus();
      },500);
    }
    //Validamos Los datos que no se vayan vacios
    const validar = () =>{
      var parametros;
      var metodo;
      if (nombre.trim() === '') {
        show_alet('Escribe el nombre del producto', 'warning');
      }
      else if (descripcion.trim() === '') {
        show_alet('Escribe la descripcion del producto', 'warning');
      }
      else if (precio === '') {
        show_alet('Escribe el precio del producto', 'warning');
      }
      else{
        //ya validando que no se vayan los datos vacios procedemos a realzar la operacion
        if (opereacion === 1) {
          parametros={nombre:nombre.trim(), descripcion:descripcion.trim(), precio:precio};
          metodo = 'POST';
        }
        else{
          parametros={id:id,nombre:nombre.trim(), descripcion:descripcion.trim(), precio:precio};
          metodo = 'PUT';
        }
        //Enviamos La Solicitud
        enviarSolicitud(metodo, parametros);
      }
    }

    //Realizamos el metodo de enviar la solicitud 
    const enviarSolicitud = async(metodo,parametros) =>{
      await axios({method:metodo, url:url, data:parametros}).then(function(respuesta){
        var tipo = respuesta.data[0];
        var msj = respuesta.data[1];
        show_alet(msj,tipo);
        if (tipo === 'success'){ {
          document.getElementById('btnCerrar').click();
          getProductos();
        }
      }
      })
      .catch(function(error){
        show_alet('Error en la solicitud:', 'error');
        console.log(error);
      });
    }

    const eliminarProducto = (id,nombre) => {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: '¿Seguro de eliminar el producto '+nombre+ '?',
        icon: 'question', text: 'No se podra dar marcha atras',
        showCancelButton:true, confirmButtonText:'Si, Eliminar', cancelButtonText:'Cancelar'
      }).then((result) => {
          if (result.isConfirmed) {
              setId(id);
              enviarSolicitud('DELETE',{id:id});
          }else{
            show_alet('El Producto No Fue Eliminado', 'info');
          }
      });
    }

  return (
    <div className= 'App'>
      <div className= 'container-fluid'>
          <div className ='row mt-3'>
              <div className= 'col-md-4 offset-4'>
                  <div className = 'd-grid mx-auto'>
                      {/* colocamos 1 para cuando abra muestre el tituilo 1 "setTitulo('Registrar Productos');"  */}
                      <button onClick={()=> openModal(1)} className= 'btn btn-dark' data-bs-toggle= 'modal' data-bs-target='#modalProductos'>
                          <i className= 'fa-solid fa-circle-plus'></i> Añadir
                      </button>
                  </div>
              </div>
          </div>
          <div className='row mt-3 row justify-content-center'>
            <div className='col-12 col-lg-8 offset-0 offset-lg-12'>
              <div className='table-responsive' >
                <table className='table table-hover'>
                  <thead>
                    <tr>
                      <th scope='col'>#</th>
                      <th scope='col'>Productos</th>
                      <th scope='col'>Descripcion</th>
                      <th scope='col'>Precio</th>
                    </tr>
                  </thead>
                  <tbody className='table-group-divider'>
                    {/* Añadimos e insertamos los productos de la api */}
                    {productos.map( (productos,i) =>(
                      <tr key={productos.id}>
                        <td>{(i+1)}</td>
                        <td>{productos.nombre}</td>
                        <td>{productos.descripcion}</td>
                        <td>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(productos.precio)}</td>
                        <td>
                          {/* colocamos 2 para cuando abra muestre el tituilo 2 setTitulo('Editar Productos'); y le pasamos el producto con sus caracteristicas al darle click al boton */}
                          <button onClick={()=> openModal(2,productos.id,productos.nombre,productos.descripcion,productos.precio)} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalProductos'>
                            <i className='fa-solid fa-edit'></i>
                          </button>
                          &nbsp;
                          <button onClick={()=>eliminarProducto(productos.id, productos.nombre)} className='btn btn-danger'>
                            <i className='fa-solid fa-trash'></i>
                          </button>

                        </td>
                      </tr>
                    ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
      </div>
      <div id='modalProductos' className='modal fade' aria-hidden='true'>
        <div className='modal-dialog'> 
          <div className='modal-content'>
            <div className='modal-header'>
              <label className='h5'>{titulo}</label>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
            <div className='modal-body'>
              <input type='hidden' id='id'></input>

              {/* Nombre */}
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-address-card'></i></span>
                <input type='text' id='nombre' className='form-control' placeholder='Escribe Nombre Del Producto' value={nombre}
                onChange={(e) => setNombre(e.target.value)}></input>
              </div>

              {/* Descripcion */}
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-comment'></i></span>
                <input type='text' id='descripcion' className='form-control' placeholder='Escribe La Descripcion Del Producto' value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}></input>
              </div>

              {/* Precio */}
              <div className='input-group mb-3'>
                  <span className='input-group-text'><i className='fa-solid fa-usd'></i></span>
                  <input type='text' id='precio' className='form-control' placeholder='Escribe El Precio Del Producto' value={precio}
                  onChange={(e) => setPrecio(e.target.value)}></input>
              </div>
              
              {/* Boton De Guardar */}
              <div className='d-grid col-6 mx-auto'>
                <button onClick={() => validar()} className='btn btn-success'>
                  <i className='fa-solid fa-floppy-disk'></i>Guardar
                </button>
              </div>
            </div>
            {/* Boton de Cerrar */}
            <div className='modal-footer'>
              <button type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShowProducts
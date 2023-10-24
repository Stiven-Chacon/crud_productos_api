import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';


export function show_alet(mensaje, icono, foco='') {
    onFocus(foco)
    const MySwal = withReactContent(Swal);
    MySwal.fire({
        title: mensaje,
        icon: icono
    })
}

function onFocus(foco) {
    if (foco !=='') {
        document.getElementById(foco).focus();
    }
    
}


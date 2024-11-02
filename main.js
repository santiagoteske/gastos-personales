let gastos = [];


//Llamo a mostrarGastos apenas se carga la pagina.
document.addEventListener("DOMContentLoaded", function() {
  mostrarGastos(gastos);
});

const mostrarGastos = (gastos) => {
  if (gastos.length > 0) {

    for (let i = 0; i < gastos.length; i++) {
      console.log(`Fecha: ${gastos[i].fecha}, Categoría: ${gastos[i].categoria}, Detalle: ${gastos[i].detalle}, Valor: $${gastos[i].valor}`);
    }    

  } else {
    console.log("Aún no se ha ingresado ningún gasto. Ingrese un nuevo gasto tocando el botón en pantalla.");
  }
}


const unirCampos = (fecha,categoria,detalle,valor) => {
  
  let campos = {
    fecha : fecha,
    categoria: categoria,
    detalle: detalle,
    valor: valor
  };

  return campos;  
} 

const registrarGasto = () => {
  
  console.log("Usted esta ingresando un nuevo gasto: "); 
  
  let fecha = prompt("Ingrese la fecha del gasto");
  console.log("Fecha : "+fecha);
  
  let categoria = prompt("Asigna una categoría a tu gasto");
  console.log("Categoría :"+categoria);
  
  let detalle = prompt("Ingresa el detalle del gasto");
  console.log("Detalle: "+detalle);
  
  let valor = prompt("Ingresa el valor de tu gasto");
  console.log("Valor :"+valor);
  
  const confirmarAdicion = confirm("Visualice los datos ingresados en la consola. ¿Confirma la creación del gasto?");  
  
  if (confirmarAdicion) {    
    let nuevoGasto = unirCampos(fecha,categoria,detalle,valor);    

    gastos.unshift(nuevoGasto);

    console.log("Su gasto fue agregado correctamente");    

    mostrarGastos(gastos);

  }else{
    console.log("Gasto NO AGREGADO.");
    
  }

};
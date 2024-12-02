document.addEventListener("DOMContentLoaded", function () {
  cargarTabla();

  // Limpiar el formulario al abrir el modal
  const modalGasto = document.getElementById("modalGasto");
  modalGasto.addEventListener("shown.bs.modal", function () {
    document.getElementById("formGasto").reset();
  });
});

// Carga datos del localStorage y los muestra en la tabla
function cargarTabla() {
  const tablaBody = document.getElementById("tabla-body");
  const patrimonioTotalElement = document.getElementById("patrimonioTotal");
  const datos = JSON.parse(localStorage.getItem("tablaDatos")) || [];
  
  // Limpiar tabla antes de cargar datos
  tablaBody.innerHTML = "";
  let patrimonioTotal = 0;
  
  if (datos.length === 0) {
    // Si no hay datos cargados previamente se muestra una fila en color gris
    const fila = document.createElement("tr");
    fila.style.color = "#6c757d";
    fila.innerHTML = `<td colspan="4" class="text-center">Aún no se han registrado gastos</td>`;
    tablaBody.appendChild(fila);
  } else {
    // Mostrar filas con datos y calcular el patrimonio
    datos.forEach((item) => {
      const fila = document.createElement("tr");

      // Asignar clases CSS segun el tipo de transaccion
      if (item.transaccion === "Ingreso") {
        fila.classList.add("fila-ingreso");
        patrimonioTotal += item.monto;  // Aumentar patrimonio total si es Ingreso
      } else if (item.transaccion === "Gasto") {
        fila.classList.add("fila-gasto");
        patrimonioTotal -= item.monto;  // Disminuir patrimonio total si es Gasto
      }

      fila.innerHTML = `
        <td>${item.transaccion}</td>
        <td>${item.detalle}</td>
        <td>${item.monto.toFixed(2)}</td>
        <td>${item.fecha}</td>
      `;
      tablaBody.appendChild(fila);
    });
  }
  patrimonioTotalElement.textContent = `Patrimonio Total: $${patrimonioTotal.toFixed(2)}`;
}

// Registrar un nuevo gasto o ingreso
document.getElementById("formGasto").addEventListener("submit", function (e) {
  e.preventDefault();

  // Obtener valores del formulario
  const transaccion = document.getElementById("inputTransaccion").value;
  const detalle = document.getElementById("inputDetalle").value;
  const monto = parseFloat(document.getElementById("inputMonto").value);
  const fecha = document.getElementById("inputFecha").value;

  // Crear nuevo gasto o ingreso
  const nuevoGasto = { transaccion, detalle, monto, fecha };

  // Obtener datos existentes del localStorage
  const datos = JSON.parse(localStorage.getItem("tablaDatos")) || [];
  datos.push(nuevoGasto);

  // Guardar de nuevo en localStorage
  localStorage.setItem("tablaDatos", JSON.stringify(datos));

  // Recargar tabla y cerrar modal
  cargarTabla();
  document.querySelector(".btn-close").click();
});
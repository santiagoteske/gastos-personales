document.addEventListener("DOMContentLoaded", function () {
  cargarTabla();

  const modalGasto = document.getElementById("modalGasto");
  const btnEliminar = document.getElementById("btnEliminar");

  // Limpiar el formulario al abrir el modal
  modalGasto.addEventListener("shown.bs.modal", function () {
    document.getElementById("formGasto").reset();
    document.getElementById("formGasto").classList.remove("was-validated"); // Limpiar los errores previos
  });
});

// Validar el formulario antes de enviarlo
document.getElementById("formGasto").addEventListener("submit", async function (e) {
  e.preventDefault();

  const transaccion = document.getElementById("inputTransaccion").value;
  const detalle = document.getElementById("inputDetalle").value;
  const monto = parseFloat(document.getElementById("inputMonto").value);
  const fecha = document.getElementById("inputFecha").value;

  let valid = true;

  // Validación de Transacción
  if (!transaccion) {
    document.getElementById("inputTransaccion").classList.add("is-invalid");
    valid = false;
  } else {
    document.getElementById("inputTransaccion").classList.remove("is-invalid");
  }

  // Validación de Detalle
  if (!detalle.trim()) {
    document.getElementById("inputDetalle").classList.add("is-invalid");
    valid = false;
  } else {
    document.getElementById("inputDetalle").classList.remove("is-invalid");
  }

  // Validación de Monto
  if (isNaN(monto) || monto <= 0) {
    document.getElementById("inputMonto").classList.add("is-invalid");
    valid = false;
  } else {
    document.getElementById("inputMonto").classList.remove("is-invalid");
  }

  // Validación de Fecha
  if (!fecha) {
    document.getElementById("inputFecha").classList.add("is-invalid");
    valid = false;
  } else {
    document.getElementById("inputFecha").classList.remove("is-invalid");
  }

  // Si todos los campos son válidos, se envía el formulario
  if (valid) {
    const nuevoGasto = { transaccion, detalle, monto, fecha };

    try {
      await fetch("http://localhost:3000/gastos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoGasto),
      });

      cargarTabla();
      document.querySelector(".btn-close").click(); // Cerrar modal
    } catch (error) {
      console.error("Error al registrar el gasto:", error);
    }
  } else {
    // Mostrar los mensajes de error si alguno de los campos no es válido
    document.getElementById("formGasto").classList.add("was-validated");
  }
});

// Eliminar operación
document.getElementById("tabla-body").addEventListener("click", function (e) {
  const fila = e.target.closest("tr");
  if (fila && e.target.id === "btnEliminar") {
    const id = fila.dataset.id; // Obtener ID desde el atributo data-id

    // Confirmar eliminación
    const confirmacion = confirm("¿Estás seguro de que deseas eliminar este registro?");
    if (confirmacion) {
      eliminarGasto(id);
    }
  }
});

async function eliminarGasto(id) {
  try {
    await fetch(`http://localhost:3000/gastos/${id}`, {
      method: "DELETE",
    });

    cargarTabla();
  } catch (error) {
    console.error("Error al eliminar el gasto:", error);
  }
}

async function cargarTabla() {
  const tablaBody = document.getElementById("tabla-body");
  const patrimonioTotalElement = document.getElementById("patrimonioTotal");

  try {
    const response = await fetch("http://localhost:3000/gastos");
    const datos = await response.json();

    tablaBody.innerHTML = "";
    let patrimonioTotal = 0;

    if (datos.length === 0) {
      const fila = document.createElement("tr");
      fila.style.color = "#6c757d";
      fila.innerHTML = `<td colspan="4" class="text-center">Aún no se han registrado gastos</td>`;
      tablaBody.appendChild(fila);
    } else {
      datos.forEach((item) => {
        const fila = document.createElement("tr");
        fila.dataset.id = item.id; // Asigna el ID del backend a la fila
        if (item.transaccion === "Ingreso") {
          fila.classList.add("fila-ingreso");
          patrimonioTotal += item.monto;
        } else if (item.transaccion === "Gasto") {
          fila.classList.add("fila-gasto");
          patrimonioTotal -= item.monto;
        }

        fila.innerHTML = `
          <td>${item.transaccion}</td>
          <td>${item.detalle}</td>
          <td>${item.monto.toFixed(2)}</td>
          <td>${item.fecha}</td>
          <td><button id="btnEliminar" class="btn btn-danger btn-sm">Eliminar</button></td>
        `;
        tablaBody.appendChild(fila);
      });
    }
    patrimonioTotalElement.textContent = `Patrimonio Total: $${patrimonioTotal.toFixed(2)}`;
  } catch (error) {
    console.error("Error al cargar la tabla:", error);
  }
}

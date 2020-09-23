/* nueva sintaxis */
/* ahora se recomienda usar querySelector en lugar de getElementById */
const formularioContactos = document.querySelector("#contacto"), // como seleccionamos un id le ponemos //#endregion
  listadoContactos = document.querySelector("#listado-contactos tbody"), // seleccionamos la tabla y el tbody
  inputBuscador = document.querySelector("#buscar");

eventListeners();

function eventListeners() {
  // Cuando el formulario de crear o editar se ejecuta
  formularioContactos.addEventListener("submit", leerFormulario); // aca esperamos que se accione el boton, y le pasamos la funcion leerFormulario

  // Listener para eliminar boton
  if (listadoContactos) {
    // haciendo esta movida con este if, no asguramos de que no salte un error en la pagina editar, ya que ahi 'no existe' la funcion, pero aca le decimos que solo lo ejecute si justamente existe
    listadoContactos.addEventListener("click", eliminarContacto);
  }

  // buscador
  inputBuscador.addEventListener("input", buscarContactos);

  numeroContactos();
}

function leerFormulario(e) {
  e.preventDefault(); // prevenimos que el form haga lo que hace por default

  // Leer los datos de los inputs

  const nombre = document.querySelector("#nombre").value,
    empresa = document.querySelector("#empresa").value,
    telefono = document.querySelector("#telefono").value,
    accion = document.querySelector("#accion").value;

  if (nombre === "" || empresa === "" || telefono === "") {
    // 2 parametros: texto y clase
    mostrarNotificacion("Todos los campos son obligatorios", "error");
  } else {
    // pasa la validacion, crear llamado a AJAX
    const infoContacto = new FormData();
    infoContacto.append("nombre", nombre); // le pasamos una llave y un valor 'nombre', nombre
    infoContacto.append("empresa", empresa);
    infoContacto.append("telefono", telefono);
    infoContacto.append("accion", accion);

    // console.log(...infoContacto);  probamos que se pasen los datos con un spread operator ..., ya que los datos del FormData() no se pueden leer asi nomas

    if (accion === "crear") {
      // crearemos un nuevo contacto
      insertarBD(infoContacto); // a esta funcion le pasamos toda la info
    } else {
      // editar el contacto
      // leer el id
      const idRegistro = document.querySelector("#id").value; // esto va a leer el id en el hidden input, y va a traer su value
      infoContacto.append("id", idRegistro); // aca le agregamos a infoContacto el id
      actualizarRegistro(infoContacto);
    }
  }
}

// inserta en la base de datos via AJAX
function insertarBD(datos) {
  // llamado a AJAX

  // crear el objeto
  const xhr = new XMLHttpRequest();

  // abrir la conexion
  xhr.open("POST", "inc/modelos/modelo-contactos.php", true); // recordar que toma 3 parametros

  // pasar los datos
  xhr.onload = function () {
    if (this.status === 200) {
      //console.log(JSON.parse(xhr.responseText)); // esto JSON.parse , nos permite convertir los datos y hacerlos accesibles
      //leemos la respuesta de PHP
      const respuesta = JSON.parse(xhr.responseText); // JSON parse lo convierte en un objeto

      // inserta un nuevo elemento en la tabla
      const nuevoContacto = document.createElement("tr");
      //aca usamos un template string para crear el nuevo contacto
      //recordar que accedemos a los valores con js adentro del template string asi ${}
      nuevoContacto.innerHTML = `
            <td>${respuesta.datos.nombre}</td>
            <td>${respuesta.datos.empresa}</td>
            <td>${respuesta.datos.telefono}</td>
            `;

      //contenedor para los botones
      const contenedorAcciones = document.createElement("td");

      //crear el icono editar
      const iconoEditar = document.createElement("i");
      iconoEditar.classList.add("fas", "fa-pen-square"); //notar que se pone asi ya que son 2 cadenas de nombre

      //crear el enlace para editar
      const btnEditar = document.createElement("a");
      btnEditar.appendChild(iconoEditar); // esto es buenisimo, creamos el a, y de hijo, le agregamos el icono de editar, ya que estan adentro los i
      btnEditar.href = `editar.php?id=${respuesta.datos.id_insertado}`; // aca le damos el id del elemento, asi, al presionar, nos llevara a ese elemento para editarlo
      btnEditar.classList.add("btn", "btn-editar"); // aca le agregamos las clases que le determinamos a esos botones asi quedan bien pitucos

      // lo agregamos al padre
      contenedorAcciones.appendChild(btnEditar); // aca queda el boton adentro del td

      // crear el icono de eliminar
      const iconoEliminar = document.createElement("i");
      iconoEliminar.classList.add("fas", "fa-trash-alt");

      // crear el boton de eliminar

      const btnEliminar = document.createElement("button");
      btnEliminar.appendChild(iconoEliminar);
      btnEliminar.setAttribute("data-id", respuesta.datos.id_insertado); // aca tomamos el data-id del elemento, para poder eliminarlo
      btnEliminar.classList.add("btn", "btn-borrar");

      //lo agregamos al padre
      contenedorAcciones.appendChild(btnEliminar); //tener en cuenta que se agrega al td

      //agregarlo al tr
      nuevoContacto.appendChild(contenedorAcciones); // ESTO ES LO QUE CREA UN NUEVO CONTACTO CON TODOS LOS TD

      // agregar el elemento al listado
      listadoContactos.appendChild(nuevoContacto);

      // resetear el form
      document.querySelector("form").reset(); // elegimos el form, y usamos un metodo de javaScript que sirve para resetear un formulario

      // mostrar la notificacion
      mostrarNotificacion("Contacto creado correctamente", "correcto"); // primero toma el mensaje, y despues toma la clase

      // actualizamos numero de registros
      numeroContactos();
    }
  };

  // enviar los datos
  xhr.send(datos);

  // opcional, leer los errores
}

// Actualizar registros en la Bd
function actualizarRegistro(datos) {
  // crear el objeto
  const xhr = new XMLHttpRequest();

  // abrir la conexion
  xhr.open("POST", "inc/modelos/modelo-contactos.php", true);

  // leer la respuesta
  xhr.onload = function () {
    if (this.status === 200) {
      const respuesta = JSON.parse(xhr.responseText);
      if (respuesta.respuesta === "correcto") {
        // tener encuenta que aca le damos el key del array $respuesta por eso es resultado.respuesta

        mostrarNotificacion("Contacto modificado", "correcto");
        // despues de 3 segundos redireaccionamos al index
        setTimeout(() => {
          window.location.href = "index.php";
        }, 3000);
      } else {
        //mostramos una notificacion
        mostrarNotificacion("Hubo un error...", "error"); // reutilizamos esta funcion
      }
    }
  };

  // enviar la peticion
  xhr.send(datos); // en este caso es una peticion del tipo POST y le pasamos los datos del parametro
}

// Eliminar el contacto

function eliminarContacto(e) {
  // aca hacemos la delegation, el e nos va a reportar a qué le dimos click
  if (e.target.parentElement.classList.contains("btn-borrar")) {
    // este es un buen ejemplo, de como nos muestra que elegimos, segun lo que seleccionemos nos mostrara el elemento en la consola, vamos a usar traversing the dom, vamos a ir del hijo hacia el padre con .parentElement, el classList.contains, se va a fijar si existe la clase que le pasemos, en el elemento
    // tomamos el id del elemento seleccionado
    const id = e.target.parentElement.getAttribute("data-id");
    //console.log(id);

    //preguntar al usuario si esta seguro de eliminar la info
    const respuesta = confirm(
      "¿Estas seguro(a) que deseas borrar el contacto?"
    ); // con esto usamos la confirmacion nativa que viene en el navegador

    /*if (respuesta) {  al usar este if, pasando la confirmacion nativa, implica que el if se refiere al OK, el else al CANCEL
                console.log('Si, seguro!');
        }else {
            console.log('No, dejame pensarlo...');
        } ESTO DE ACA SIRVIO DE PRUEBA, PERO ESTA BUENO PARA ENTENDER COMO FUNCIONA */

    if (respuesta) {
      // llamado a AJAX
      // crear el objeto
      const xhr = new XMLHttpRequest();

      // abrir la conexion
      xhr.open(
        "GET",
        `inc/modelos/modelo-contactos.php?id=${id}&accion=borrar`,
        true
      ); // en este caso va a ser get, porque vamos a extraer un dato ya existente en la base de datos, entonces vamos a eliminar el id por medio de la URL, le pasamos un template string y le damos el id que creamos arriba y tambien le agregamos &accion=borrar, porque le estamos pasando dos parametros. el true, igual que cuando insertabamos datos, hace que esta consulta sea asincrona

      // leer la respuesta
      xhr.onload = function () {
        // aca la lectura es igual
        if (this.status === 200) {
          const respuesta = JSON.parse(xhr.responseText);

          if (respuesta.respuesta === "correcto") {
            // tener encuenta que aca le damos el key del array $respuesta por eso es resultado.respuesta
            // Eliminar el registro del DOM
            e.target.parentElement.parentElement.parentElement.remove(); // recordamos como hicimos arriba para seleccionar al padre, y en este caso para eliminar completamente el registro tenemos que subir 3 niveles

            //mostrar notificacion
            mostrarNotificacion("Contacto eliminado", "correcto");
            // actualizamos numero de registros
            numeroContactos();
          } else {
            //mostramos una notificacion
            mostrarNotificacion("Hubo un error...", "error"); // reutilizamos esta funcion
          }
        }
      };

      // enviar la peticion
      xhr.send();
    }
  }
}

// notificacion en pantalla

function mostrarNotificacion(mensaje, clase) {
  const notificacion = document.createElement("div"); // queda claro con esto que con javascript podemos hacer lo que queramos, aca creamos un div
  notificacion.classList.add(clase, "notificacion", "sombra"); // le agregamos esta clase al elemento que creamos
  notificacion.textContent = mensaje;

  //formulario
  formularioContactos.insertBefore(
    notificacion,
    document.querySelector("form legend")
  ); // aca le pasamos que vamos a insertar, y antes de que

  // Ocular y mostrar la notificacion

  setTimeout(() => {
    // esta funcion espera un cierto tiempo para ejecutarse
    notificacion.classList.add("visible");
    setTimeout(() => {
      notificacion.classList.remove("visible");
      setTimeout(() => {
        notificacion.remove(); // esto remueve el elemento por completo, ya que, si no agregamos esto, el elemento seguira ahi, invisible, pero seguira ahi, lo correcto es esto, borrarlo por completo
      }, 500); // agregamos otro nuevo setTimeout, para que no se remueva tan de golpe la notificacion
    }, 3000); // despues de 3 segundos se removerá la clase
  }, 100); // le damos 100, es decir una decima parte de un segundo
}

// buscador de contactos

function buscarContactos(e) {
  // notar esto, porque jamas lo hicimos, aca usamos una expresion
  // el segundo parametro del RegExp, "i", es el key insensitive, lo que indica que no importa como escribas en el buscador, mayusculas o minusculas
  // te va a traer los registros igual, es otra forma de hacer posible la busqueda, sin usar toLowerCase o toUpperCase
  const expresion = new RegExp(e.target.value, "i"),
    registros = document.querySelectorAll("tbody tr");

  registros.forEach((registro) => {
    registro.style.display = "none";
    //console.log(registro.childNodes[1].textContent);

    // aca hacemos que evaluel lo que fue escrito en el campo de busqueda con lo que se encuentra en la base de datos
    // esto va a buscar entonces de nuestra var espresion que definimos ahi arriba, y lo va a comparar con todos los resgistros existentes
    // el distinto a -1 del final, sirve para indicar que queremos solo los registros que sean true, ya que este codigo sin ese -1 del final
    // devolvera todos los registros, tanto los true, que son los que tienen caracteres similares y los false,
    // en el raplace, lo que hacemos con esto /\s/g, " ", es buscar, si es que llega a existir un registro con 2 nombres
    // es buscar y reemplazar ese espacio por " ", es decir, por el espacio que existe realmente, pero tenemos que hacer este replace para
    // hacer posible la busqueda en los 2 nombres
    if (
      registro.childNodes[1].textContent
        .replace(/\s/g, " ")
        .search(expresion) != -1
    ) {
      // tener en cuenta que estamos en una tabla entonces aca para hacer visibles los registros le damos table-row, si estuvieramos hablando
      // de otro elemento como contenedor tal vez le pasariamos display block
      registro.style.display = "table-row";
    }
    numeroContactos();
  });
}

// muestra el numero de contactos
// nota: mandamos a llamar la funcion en los eventListeners y en el buscador de contactos, es importante para hacer posible que aparezca el numero
// tambien lo agregamos en donde insertamos registro en la bd y donde borramos contacto
function numeroContactos() {
  const totalContatos = document.querySelectorAll("tbody tr"),
    contenedorNumero = document.querySelector(".total-contactos span");
  let total = 0;

  totalContatos.forEach((contacto) => {
    // aca ignoramos los valores none
    if (
      contacto.style.display === "" ||
      contacto.style.display === "table-row"
    ) {
      total++;
    }
  });
  //console.log(total);
  contenedorNumero.textContent = total;
}

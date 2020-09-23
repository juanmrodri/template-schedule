<?php

    include 'inc/funciones/funciones.php'; 
    include 'inc/layout/header.php'; 

    $id = filter_var($_GET['id'], FILTER_VALIDATE_INT); // convertimos el id en un entero, es decir, si por algun motivo pasan letras no se va a recibir el dato

    if(!$id){
        die('No es válido'); // aca mostramos error si es que no existe un id como int
    }

    $resultado = obtenerContacto($id); // aca a $resultado le pasamos la funcion que toma el id

    $contacto = $resultado->fetch_assoc(); // hacemos esto para que nos traiga los resultados y los almacene en la var $contacto

?>

<div class="contenedor-barra">
    <div class="contenedor barra">
        <a href="index.php" class="btn volver">Volver</a>
        <h1>Editar contacto</h1>
    </div>
</div>

<div class="bg-amarillo contenedor sombra">
    <form id="contacto" action="#">
        <legend>Edite el contacto</legend>
        <?php include 'inc/layout/formulario.php' ?>
    </form>
</div>

<?php include 'inc/layout/footer.php'; ?>
<?php

// aca va lo de crear un elemento
if($_POST['accion'] == 'crear'){ // tomamos el id 'accion' del hidden input y nos basamos en su value 'crear'
    // creará un nuevo registro en la base de datos

    //requerimos la conexion a la bd
    require_once('../funciones/bd.php');

    //validar las entradas, para que no manden cualquier cosa
    $nombre = filter_var($_POST['nombre'], FILTER_SANITIZE_STRING); // validamos para que el campo de nombre sea una string
    $empresa = filter_var($_POST['empresa'], FILTER_SANITIZE_STRING);
    $telefono = filter_var($_POST['telefono'], FILTER_SANITIZE_STRING); // el telefono tambien lo dejamos como string, llegaran numeros pero seran strings

    try {
        // prepare statements
        $stmt = $conn->prepare("INSERT INTO contactos (nombre, empresa, telefono) VALUE (?,?,?)"); // recordar que en value los ? corresponden a cada dato
        $stmt->bind_param("sss", $nombre, $empresa, $telefono); //recordar que en el primer parametro pasamos el tipo de dato, s para strings
        $stmt->execute(); //aca le decimos que se ejecute
        if($stmt->affected_rows == 1) { // affected_rows esto sirve para saber si alguna ensercion se hizo, esto significa que el valor insertados es correcto, porque es 1
            $respuesta = array( 
                'respuesta' => 'correcto',
                'datos' => array(
                    'nombre' => $nombre,
                    'empresa' => $empresa,
                    'telefono' => $telefono,
                    'id_insertado' => $stmt->insert_id,
                )
            );
        } 

        $stmt->close(); // y luego cerramos el statement
        $conn->close(); // por las dudas cerramos la conexion tambien, independientemente de que se cierre o no, mysql la va a cerrar, pero no esta demas hacerlo
    } catch (Exception $e) {
        $respuesta = array(
            'error' => $e->getMessage() // esto es un array, asi que no lleva ; aca
        );
    }

    echo json_encode($respuesta);
}

// aca va lo que borra un elemento
if($_GET['accion'] == 'borrar') {
    require_once('../funciones/bd.php'); // aca llamamos a la bd
    $id = filter_var($_GET['id'], FILTER_SANITIZE_NUMBER_INT); // esto sanitiza para int
    try {
        $stmt = $conn->prepare("DELETE FROM contactos WHERE id_contacto = ?"); // MUY IMPORTANTE EL DATO QUE PONEMOS EN EL WHERE, YA QUE DE AHI SE BORRARA EL ELEMENTO, en este caso de damos el id = ? y este seria nuestro placeholder
        $stmt->bind_param('i', $id); // aca recordamos que el i es para enteros
        $stmt->execute();
        if($stmt->affected_rows == 1){ // recordemos el 1 significa que hubo efectivamente un cambio
                $respuesta = array(
                    'respuesta' => 'correcto'
                );
        }
        $stmt->close();
        $conn->close(); // cerramos el stmt y tambien la conexion!
    } catch(Exception $e) {
        $respuesta = array (
            'error' => $e->getMessage()
        );
    }
    echo json_encode($respuesta);
}

// aca va lo de editar un elemento

if($_POST['accion'] == 'editar') {
    //echo json_encode($_POST); 

    require_once('../funciones/bd.php'); 

    // validamos las entradas
    $nombre = filter_var($_POST['nombre'], FILTER_SANITIZE_STRING); 
    $empresa = filter_var($_POST['empresa'], FILTER_SANITIZE_STRING);
    $telefono = filter_var($_POST['telefono'], FILTER_SANITIZE_STRING);
    $id = filter_var($_POST['id'], FILTER_SANITIZE_NUMBER_INT);

    try {
        $stmt = $conn->prepare("UPDATE contactos SET nombre = ?, empresa = ? , telefono = ? WHERE id_contacto = ?"); // ver como en este caso, especificamente que vamos a cambiar y luego el placeholder "?"
        $stmt->bind_param('sssi', $nombre, $empresa, $telefono, $id);
        $stmt->execute();
        if($stmt->affected_rows == 1){
            $respuesta = array(
                'respuesta' => 'correcto'
            );
        } else {
            $respuesta = array(
                'respuesta' => 'error'
            );
        }
        $stmt->close();
        $conn->close();
    }catch(Exception $e) {
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }

    echo json_encode($respuesta);
}

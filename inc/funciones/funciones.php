<?php 

function obtenerContactos() {
    include 'bd.php';
    try {
        return $conn->query("SELECT id_contacto, nombre, empresa, telefono FROM contactos"); // con esto accedemos a esos datos
    } catch(Exception $e) {
        echo "Error!" . $e->getMessage() . "<br>";
        return false; // si hay un error que no haga nada
    }
}

// aca obtenerContactos() toma un id

function obtenerContacto($id) {
    include 'bd.php';
    try {
        return $conn->query("SELECT id_contacto, nombre, empresa, telefono FROM contactos WHERE id_contacto = $id"); // aca accedemos especificamente al id, que de hecho pasamos por parametro en este caso
    } catch(Exception $e) {
        echo "Error!" . $e->getMessage() . "<br>";
        return false; // si hay un error que no haga nada
    }
}
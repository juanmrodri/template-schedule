<?php 
include 'inc/funciones/funciones.php';
include 'inc/layout/header.php';
?>

<div class="contenedor-barra">
    <h1>agenda de Contactos</h1>
</div>

<div class="bg-amarillo contenedor sombra">
    <form id="contacto" action="#">
        <legend>Añada un contacto<span>Todos los campos son obligatorios</span></legend>
        <?php include 'inc/layout/formulario.php' ?>
    </form>
</div>

<div class="bg-blanco contenedor sombra contactos">
    <div class="contenedor contactos">
        <h2>Contactos</h2>
        <input type="text" id="buscar" class="buscador sombra" placeholder="Buscar Contactos..." >
        <p class="total-contactos"><span></span>Contactos</p>
        <div class="contenedor-tabla">
            <table id="listado-contactos" class="listado-contactos">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Empresa</th>
                        <th>Teléfono</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                <?php $contactos = obtenerContactos(); 
                       if($contactos->num_rows){ // con este num_rows sabemos la cantidad de datos que ha, entonces lo metemos en un if, para que muestre solo si hay registros claro 
                        
                            foreach($contactos as $contacto){  ?>                  
                            
                            
                        <tr>
                            <td><?php echo $contacto['nombre']; ?></td>
                            <td><?php echo $contacto['empresa']; ?></td>
                            <td><?php echo $contacto['telefono']; ?></td>
                            <td>
                                <a class="btn-editar btn" href="editar.php?id=<?php echo $contacto['id_contacto']; // tener en cuenta que aca le mandamos el id asi hacemos posible que sea editable ?>"><i class="fas fa-pen-square"></i></a>
                                <button data-id="<?php echo $contacto['id_contacto']; //y aca tambien para hacer posible que lo borremos ?>" type="text" class="btn-borrar btn"><i class="fas fa-trash-alt"></i></button>
                            </td>
                        </tr>
                        <?php  } //cierre del foreach
                    } //cierre del if ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php include 'inc/layout/footer.php' ?>
<div class="campos">
    <div class="campo">
    <label for="nombre">Nombre:</label>
       <input  
            type="text" 
            placeholder="Nombre Contacto" 
            id="nombre" 
            autocomplete="off"
            value="<?php echo ($contacto['nombre']) ? $contacto['nombre'] : ''; // esto recepciona el dato desde editar.php, se ve raro pero la lectura de esto es asi, si existe el valor 'nombre', en la var $contacto, el value sera justamente, $contacto['nombre'], que es lo que dice despues del ? , es decir el nombre que viene de la tabla, y esto significa que vamos editar, caso contrario, despues del : el campo estara vacio '', esto lo hacemos asi porque hay que tener en cuenta que el campo para ingresar datos es el mismo que para editar, entonces hay que hacer esta distincion ?>"
      ><!-- Aca vamos a recepcionar los datos en caso de editar un registro existente -->
    </div>
    <div class="campo">
    <label for="empresa">Empresa:</label>
       <input 
            type="text" 
            placeholder="Nombre Empresa" 
            id="empresa" 
            autocomplete="off"
            value="<?php echo ($contacto['empresa']) ? $contacto['empresa'] : '';?>"
       >
    </div>
    <div class="campo">
    <label for="telefono">telefono:</label>
       <input 
            type="tel" 
            placeholder="Telefono" 
            id="telefono" 
            autocomplete="off"
            value="<?php echo ($contacto['telefono']) ? $contacto['telefono'] : '';?>"
       >
    </div>    
</div>
<div class="campo enviar">
   <?php 
      $textoBtn = ($contacto['telefono'] ? 'guardar' : 'añadir'); // es genial esto, aca usamos esta forma de chequear igual que arriba, y cualquier dato nos sirve, ya que todos son obligatorios, usamos telefono, entonces esta variable guarda un dato, en caso de que exista el dato que le pasamos, lo que guarda, es 'guardar', en caso de que no exista, lo que significa que el campo esta vacio, 'añadir', y despues, abajo, en el value del boton, imprimimos este dato
      $accion = ($contacto['telefono'] ? 'editar' : 'crear'); // hacemos lo mismo para el boton oculto
   ?>
    <input type="hidden" id="accion" value="<?php echo $accion; ?>">
    <?php if(isset($contacto['id_contacto'])) { ?>
          <input type="hidden" id="id" value="<?php echo $contacto['id_contacto'];?>">
    <?php } ?>
    <input type="submit" value="<?php echo $textoBtn; ?>">
</div>
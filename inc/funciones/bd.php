<?php 

//credenciales de la base de datos
// usamos constantes para definirlos
define('DB_USUARIO', 'root'); // aca definimos el usuario de la base de datos
define('DB_PASSWORD', 'Torero77');
define('DB_HOST', 'localhost');
define('DB_NOMBRE', 'agendaphp');
define('DB_PORT', '3306');

$conn = new mysqli(DB_HOST, DB_USUARIO, DB_PASSWORD, DB_NOMBRE, DB_PORT); // recordar que toma 4 parametros y son en el orden en el que estan aca, SI NO LLEGA A FUNCIONAR CON ESTOS 4, puede ser que falte poner el puerto, aca lo pasamos por las dudas

//echo $conn->ping(); ESTA ES UNA BUENA FORMA DE SABER SI SE ESTA REALIZANDO BIEN LA CONEXION, SI NOS TIRA UN 1 ES POR QUE ESTA TODO BIEN
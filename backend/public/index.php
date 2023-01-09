<?php

use App\Kernel;

require_once dirname(__DIR__) . '/vendor/autoload_runtime.php';
header('Access-Control-Allow-Origin: http://localhost:3500');
header('Access-Control-Expose-Headers: authtoken');
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Headers: authtoken, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
$method = $_SERVER['REQUEST_METHOD'];
if ($method == "OPTIONS") {
    die();
}
return function (array $context) {
    return new Kernel($context['APP_ENV'], (bool)$context['APP_DEBUG']);
};

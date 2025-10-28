<?php
session_start();

// Настройки приложения
$client_id = "54274874"; // тот же ID
$client_secret = "e66734ede66734ede66734ed2ce55b1fd7ee667e66734ed8f67de7802e4d06166dd06d5";
$redirect_uri = "https://mixercheck.vercel.app/vk.php";

// Проверяем наличие кода
if (!isset($_GET['code'])) {
    exit('Ошибка: отсутствует параметр code.');
}

$code = $_GET['code'];

// 1. Обмен кода на токен
$token_url = "https://id.vk.com/oauth2/token";

$params = [
    'grant_type' => 'authorization_code',
    'code' => $code,
    'client_id' => $client_id,
    'client_secret' => $client_secret,
    'redirect_uri' => $redirect_uri,
];

$options = [
    'http' => [
        'method'  => 'POST',
        'header'  => "Content-Type: application/x-www-form-urlencoded\r\n",
        'content' => http_build_query($params)
    ]
];

$response = file_get_contents($token_url, false, stream_context_create($options));
$data = json_decode($response, true);

if (!isset($data['id_token'])) {
    exit('Ошибка авторизации: ' . htmlspecialchars($response));
}

// 2. Расшифровываем ID-токен (JWT)
list($header, $payload, $signature) = explode('.', $data['id_token']);
$payload = json_decode(base64_decode(strtr($payload, '-_', '+/')), true);

// 3. Сохраняем данные пользователя
$_SESSION['user'] = [
    'id' => $payload['sub'],
    'name' => $payload['name'] ?? ($payload['given_name'] . ' ' . $payload['family_name']),
    'email' => $payload['email'] ?? '',
    'picture' => $payload['picture'] ?? ''
];

// 4. Перенаправляем
header("Location: /everything.html");
exit;
?>

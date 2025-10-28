<?php
session_start();

// === Настройки приложения ===
$client_id = "54274874";  // ID твоего VK приложения
$client_secret = "e66734ede66734ede66734ed2ce55b1fd7ee667e66734ed8f67de7802e4d06166dd06d5";
$redirect_uri = "https://mixercheck.local/auth/vk.php"; // тот же redirect_uri, что в настройках VK

// === Проверяем, что пришёл параметр code ===
if (!isset($_GET['code'])) {
    exit('Ошибка: не получен параметр code от ВКонтакте');
}

$code = $_GET['code'];

// === 1. Обмен code → access_token ===
$token_url = "https://oauth.vk.com/access_token?" . http_build_query([
    'client_id' => $client_id,
    'client_secret' => $client_secret,
    'redirect_uri' => $redirect_uri,
    'code' => $code,
]);

$token_response = file_get_contents($token_url);
if ($token_response === false) {
    exit('Ошибка при обращении к VK API.');
}

$data = json_decode($token_response, true);

if (!isset($data['access_token'])) {
    exit('Ошибка авторизации: ' . htmlspecialchars($token_response));
}

// === 2. Получаем данные пользователя ===
$user_info_url = "https://api.vk.com/method/users.get?" . http_build_query([
    'user_ids' => $data['user_id'],
    'fields' => 'photo_200',
    'access_token' => $data['access_token'],
    'v' => '5.131'
]);

$user_response = file_get_contents($user_info_url);
if ($user_response === false) {
    exit('Ошибка при получении данных пользователя.');
}

$user_data = json_decode($user_response, true);

if (!isset($user_data['response'][0])) {
    exit('Ошибка: не удалось получить данные пользователя.');
}

$user = $user_data['response'][0];

// === 3. Сохраняем данные в сессию ===
$_SESSION['user'] = [
    'id' => $user['id'],
    'name' => $user['first_name'] . ' ' . $user['last_name'],
    'photo' => $user['photo_200'],
    'email' => $data['email'] ?? ''
];

// === 4. Перенаправляем на главную страницу ===
header("Location: /everything.html");
exit;
?>

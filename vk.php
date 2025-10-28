<?php
session_start();

$client_id = "54274874";       // из VK
$client_secret = "e66734ede66734ede66734ed2ce55b1fd7ee667e66734ed8f67de7802e4d06166dd06d5";
$redirect_uri = "https://mixercheck.local/auth/vk.php"; // тот же redirect_uri

if (!isset($_GET['code'])) {
    exit('Ошибка: не получен параметр code');
}

$code = $_GET['code'];

// 1. Обмениваем code → токен
$token_url = "https://oauth.vk.com/access_token?" .
    "client_id={$client_id}&client_secret={$client_secret}" .
    "&redirect_uri={$redirect_uri}&code={$code}";

$token_response = file_get_contents($token_url);
$data = json_decode($token_response, true);

if (!isset($data['access_token'])) {
    exit('Ошибка авторизации: ' . htmlspecialchars($token_response));
}

// 2. Получаем информацию о пользователе
$user_info_url = "https://api.vk.com/method/users.get?" .
    "user_ids={$data['user_id']}&fields=photo_200&access_token={$data['access_token']}&v=5.131";
$user_response = file_get_contents($user_info_url);
$user = json_decode($user_response, true)['response'][0];

// 3. Сохраняем пользователя в сессию
$_SESSION['user'] = [
    'id' => $user['id'],
    'name' => $user['first_name'] . ' ' . $user['last_name'],
    'photo' => $user['photo_200'],
    'email' => $data['email'] ?? ''
];

// 4. Перенаправляем в панель
header("Location: /everything.html");
exit;
?>

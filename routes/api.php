<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Роуты с префиксом api/
|
*/



// Роуты, доступные без токена доступа
Route::post('/login', 'AuthController@login');
Route::post('/register', 'AuthController@register');




// Роуты, доступные только зарегистрированным пользователям (предоставившим
// заголовок Authorization со значением "Bearer {токен}", где токен - токен, 
// полученный в результате отправки POST-формы
// с email-ом и паролем на роут /login)

// Вернет данные пользователя
Route::get('/user', 'UserController@getMe')->middleware('auth:api');

// Обновит данные пользователя присланными в запросе
Route::patch('/user', 'UserController@update')->middleware('auth:api');

// Удалит все токены доступа, принадлежащие пользователя из базы (они перестанут приниматься)
Route::post('/logout', 'AuthController@logout')->middleware('auth:api');


// Вернет список ссылок пользователя
Route::get('/links', 'LinksController@index')->middleware('auth:api');
// Добавит ссылку
Route::post('/links', 'LinksController@store')->middleware('auth:api');
// Вернет статьи ссылки
Route::get('/links/{link}', 'LinksController@show')->middleware('auth:api');
// Отвяжет ссылку от пользователя
Route::delete('/links/{link}', 'LinksController@destroy')->middleware('auth:api');


// Вернет полное состояние пользователя в базе данных
// (имя, емейл, ссылки и к каждой ссылке её статьи),
// чтобы не делать несколько запросов с клиента
Route::get('/getFullState', 'UserController@getFullState')->middleware('auth:api');


// Test
Route::post('/subscribeToAllLinks', 'UserController@subscribeToAllLinks')->middleware(['auth:api', 'role:admin']);
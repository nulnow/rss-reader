<?php

namespace App\Http\Controllers;

use App\Link;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LinksController extends Controller
{
    /**
     * Метод возвращает все ссылки пользователя
     */
    public function index()
    {
        $links = Auth::user()->links;

        return response()->json($links, 200);
    }

    /**
     * Метод привязывает ссылку к пользователю
     */
    public function store(Request $request)
    {

        // Проверка, что ссылка существует и является строкой
        $request->validate([
            'url' => 'required|string'
        ]);

        $user = Auth::user();

        // Если этой ссылки нет в базе данных
        if (!$link = Link::where('url', $request->url)->first()) {

            // Проверяем является ли эта ссылка валидным адресом RSS ленты
            try {
                $rss = \App\Nulnow\RSSFeed::loadRss($request->url);
            } catch (\App\Nulnow\FeedException $e) {
                // Отправляем ошибку и говорим, что ссылка не является RSS каналом
                return response()->json(['message' => 'Link is not a RSS Channel'], 400);
            }

            // Если всё в норме, то создаем ссылку, сохраняем в базу данных, получаем
            // новости для неё и также сохраняем в базу
            $link = new Link;
            $link->url = $request->url;

            $link->save();
            $link->updateArticles();
            $link->refresh();

        } elseif ($user->hasLink($link)) { // Если такая ссылка есть в базе и уже есть у пользователя
            return response()->json(['message' => 'You already have this link'], 400);
        }
        
        // Если ссылка есть в базе, но её нет у пользователя, то
        // привязываем ссылку из базы к пользователю
        $user->links()->attach($link->id);
        $user->refresh();

        // Возвращаем созданную ссылку со статус кодом 201 (Created)
        return response()->json($link, 201);
    }

    /**
     * Метод возвращает статьи, принадлежащие данной ссылке
     */
    public function show(Link $link)
    {

        $user = Auth::user();

        if ($user->hasLink($link)) {

            // Делаем обновление с таймаутом
            $link->softUpdateArticles();

            // Возвращаем статьи, отсортированные по дате (новые сверху)
            $articles = $link->articles()->orderBy('pub_date', 'DEC')->get();
            return response()->json($articles, 200);

        } else {

            return response()->json(['message' => 'You do not have this link!'], 404);

        }
    }

    /**
     * Метод отвязывает ссылку от пользователя
     */
    public function destroy(Link $link)
    {
        $user = Auth::user();

        $user->links()->detach($link->id);

        // Возвращаем удаленную ссылку
        return response()->json(["message" => 'removed'], 200);
    }
}

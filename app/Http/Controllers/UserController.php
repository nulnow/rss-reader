<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Hash;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function getMe()
    {
        $user = Auth::user();
        
        return response()->json($user, 200);
    }

    /**
     * Метод обновит данные пользователя теми, что
     * пришли в запросе
     */
    public function update(Request $request)
    {
        $request->validate([
            'name' => 'nullable|string|max:50',
            'email' => 'nullable|string|max:255|unique:users',
            'password' => 'nullable|string|max:255'
        ]);

        $user = Auth::user();

        if (isset($request->name)) {
            $user->name = $request->name;
        }

        if (isset($request->email)) {
            $user->name = $request->email;
        }

        if (isset($request->email)) {
            $user->password = Hash::make($request->password);
        }

        // Если пользователь решил обновить пароль, то разовторизируем его,
        // удалив все его токены доступа из базы
        if (isset($request->password) || isset($request->email)) {
            DB::delete('delete from oauth_access_tokens where user_id = ?', [$user->id]);
        }

        return response()->json($user, 200);
    }

    public function getFullState(Request $request)
    {

        $user = Auth::user();
        $links = $user->links;
        $linnksWithArticles = [];

        foreach ($links as $link) {

            $link->softUpdateArticles();

            $linnksWithArticles[] = [
                'link' => $link,
                'articles' => $link->articles
            ];
        }

        $user->links = $linnksWithArticles;

        return response()->json(['user' => $user], 200);
    }

    public function subscribeToAllLinks ()
    {
        $user = Auth::user();
        $links = \App\Link::all();

        foreach ($links as $link) {
            if (!$user->hasLink($link)) {
                $user->links()->attach($link->id);
            }
        }

        return response()->json(['message' => 'All existed links have been attached'], 200);
    }
}

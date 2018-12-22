<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use \App\Nulnow\RSSFeed;
use \App\Article;

class Link extends Model
{

    // Минимальная задержка между обновлением
    // При использовании метода softUpdateArticles
    public static $updateTimeoutMin = 5;

    /**
     * softUpdateArticles
     * 
     * Метод обертка для updateArticles
     * 
     * нужен, чтобы обновления производились не чаще, чем
     * раз в $updateTimeoutMin минут
     */
    public function softUpdateArticles()
    {

        // Время последнего обновления статей ссылки
        $linkDate = new \DateTime($this->updated_at);

        // Текущее время
        $now = new \DateTime("now");

        // Разница между последним обновлением ссылки и текущим временеи
        $interval = $linkDate->diff($now);

        // Если с последнего обновления прошло больше минут, чем
        if ($interval->i >= self::$updateTimeoutMin) {

            // Обновить статьи
            $this->updateArticles();

        }

    }

    /**
     * Метод добавляет статиьи с ресурса ссылки в базу, если
     * этих статей в базе нет
     * 
     * Использовать в крайних случаях, вместо него желательно
     * пользоваться методом softUpdateArticles
     */
    public function updateArticles()
    {

        // Получаем данные с ресурса
        $items = RSSFeed::RSSitems($this->url);

        // Проходим по каждой статье с ресурса
        foreach($items as $item) {

            // Если этой статьи нет в базе
            if (!Article::where('url', $item['link'])->first()) {

                // Создаём и добавляем, привязывая статью к ссылке
                $article = new \App\Article();
                $article->title = $item['title'];
                $article->description = $item['description'];
                $article->url = $item['link'];  
                $article->pub_date = date('Y-m-d H:i:s', (int)$item['date']);
                $article->link_id = $this->id;
                $article->save();

            }
        }

        // Обновляем время последнего обновления ссылки
        $this->updated_at = now();

        // Сохраняем ссылку (чтобы приминились обновления поля updated_at)
        $this->save();
    }



    // Методы ниже объявляют связя модели

    public function articles()
    {
        return $this->hasMany('App\Article');
    }

    public function users()
    {
        return $this->belongsToMany('App\User', 'links_users');
    }
}

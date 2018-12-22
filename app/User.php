<?php

namespace App;

use Laravel\Passport\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * Атрибуты, которые не видно при возвращении Модели
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * Вспомогательный метод, проверяющий есть ли у
     * пользователя данная ссылка
     */
    public function hasLink($link)
    {
        foreach ($this->links as $userLink) {

            if ($userLink->id == $link->id) {
                return true;
            }

        }
        return false;
    }

    /**
     * Вспомогательный метод, проверяющий есть ли у
     * пользователя данная роль
     */
    public function hasRole($role)
    {
        foreach ($this->roles as $userRole) {
            if ($userRole->name === $role) {
                return true;
            }
        }

        return false;
    }
    
    public function links()
    {
        return $this->belongsToMany('App\Link', 'links_users');
    }

    public function roles()
    {
        return $this->belongsToMany('App\Role', 'roles_users');
    }

}

<?php

use Illuminate\Http\Request;


Route::get('/{any}', function () {

    return view('client');

})->where('any', '.*');
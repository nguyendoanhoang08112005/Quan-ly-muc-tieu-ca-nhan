<?php

use Illuminate\Support\Facades\Route;

Route::get('/{path?}', function () {
    $frontendEntry = public_path('app/index.html');

    if (file_exists($frontendEntry)) {
        return response()->file($frontendEntry);
    }

    return view('welcome');
})->where('path', '^(?!api).*$');

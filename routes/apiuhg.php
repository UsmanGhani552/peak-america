<?php

use App\Http\Controllers\AISettingsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardManagerController;
use App\Http\Controllers\DocManagerController;
use App\Http\Controllers\EmailHandlerController;
use App\Http\Controllers\InterviewDetailsController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;


// Route::post('/uploadProfilePic', [UserController::class, 'uploadProfilePic'])->name('uploadProfilePic');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')
    ->group(function () {
        Route::post('/upload-profile-pic', [UserController::class, 'uploadProfilePic']);
        Route::post('/delete-profile-pic', [UserController::class, 'deleteProfilePic']);
        Route::get('/get-user', [UserController::class, 'getUserProfile']);
        Route::put('/edit-user', [UserController::class, 'updateUserProfile']);
    });

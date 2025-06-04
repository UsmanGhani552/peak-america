<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\MultiStepFormController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\GuestIdentifier;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
// Reset Password APIs
Route::post('/password/request-reset', [AuthController::class, 'requestPasswordReset']); // Request password reset
Route::post('/password/validate-code', [AuthController::class, 'resetPasswordValidateCode']); // Validate code
Route::post('/password/reset', [AuthController::class, 'resetPassword']); // Reset password

Route::middleware('auth:sanctum')
    ->group(function () {
        Route::post('/upload-profile-pic', [UserController::class, 'uploadProfilePic']);
        Route::post('/delete-profile-pic', [UserController::class, 'deleteProfilePic']);
        Route::get('/get-user', [UserController::class, 'getUserProfile']);
        Route::put('/edit-user', [UserController::class, 'updateUserProfile']);

        // Dashboard APIs
        Route::get('/get-all-forms', [MultiStepFormController::class, 'getAllGuestForms']);
    });


Route::get('/register-guest', [GuestController::class, 'registerGuestUser']);
Route::middleware(GuestIdentifier::class)
    ->group(function () {
        Route::post('/submit-form', [MultiStepFormController::class, 'submitForm']);
        Route::post('/get-form', [MultiStepFormController::class, 'getForm']);
    });

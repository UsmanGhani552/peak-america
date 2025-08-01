<?php

use App\Http\Controllers\Admin\FormController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Auth\VerificationController;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FormAssignmentController;

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('admin')->name('admin.')->group(function () {
    // Authentication Routes...
    Route::get('login', [LoginController::class, 'showLoginForm'])->name('login');
    Route::post('login', [LoginController::class, 'login']);
    Route::get('logout', [LoginController::class, 'logout'])->name('logout');

    // Registration Routes...
    Route::get('register', [RegisterController::class, 'showRegistrationForm'])->name('register');
    Route::post('register', [RegisterController::class, 'register']);

    // Password Reset Routes...
    Route::get('password/reset', [ForgotPasswordController::class, 'showLinkRequestForm'])->name('password.request');
    Route::post('password/email', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('password.email');
    Route::get('password/reset/{token}', [ResetPasswordController::class, 'showResetForm'])->name('password.reset');
    Route::post('password/reset', [ResetPasswordController::class, 'reset'])->name('password.update');

    // Email Verification Routes...
    Route::get('email/verify', [VerificationController::class, 'show'])->name('verification.notice');
    Route::get('email/verify/{id}/{hash}', [VerificationController::class, 'verify'])->name('verification.verify');
    Route::post('email/resend', [VerificationController::class, 'resend'])->name('verification.resend');
});

Route::middleware(['auth'])->group(function () {
    Route::controller(FormController::class)->prefix('admin/unassigned-form')->name('admin.unassigned-form.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/show/{id}', 'show')->name('show');
        Route::get('/assign-form/{guest_id}', 'assignFormToUser')->name('assign');
        Route::get('/destroy/{form}', 'delete')->name('delete');
    });
    Route::controller(FormAssignmentController::class)->prefix('admin/my-form')->name('admin.my-form.')->group(function () {
        Route::get('/', 'index')->name('index');
    });
    Route::controller(FormController::class)->prefix('admin/all-form')->name('admin.all-form.')->group(function () {
        Route::get('/', 'allForms')->name('index');
    });

    Route::controller(UserController::class)->prefix('admin/user')->name('admin.user.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/create', 'create')->name('create');
        Route::post('/store', 'store')->name('store');
        Route::get('/edit/{id}', 'edit')->name('edit');
        Route::post('/update/{id}', 'update')->name('update');
        Route::get('/delete/{id}', 'delete')->name('delete');
    });
});

Route::get('/dashboard/assign-form-to-user', [DashboardController::class, 'assignFormToUser'])->name('dashboard.assignFormToUser');
Route::get('/dashboard/get-assigned-forms', [DashboardController::class, 'getAssignedForms'])->name('dashboard.getAssignedForms');
Route::get('/dashboard/get-all-unassigned-guest-forms', [DashboardController::class, 'getAllUnassignedGuestForms'])->name('dashboard.getAllUnassignedGuestForms');




Route::get('/admin', function () {
    return view('admin.dashboard');
})->name('admin.dashboard');


Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '^(?!admin).*');
Auth::routes();

Route::get('/admin/home', function(){
    return redirect('/admin/unassigned-form');
})->name('home');

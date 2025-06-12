<?php

use App\Http\Controllers\Admin\FormController;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard/assign-form-to-user', [DashboardController::class, 'assignFormToUser'])->name('dashboard.assignFormToUser');
Route::get('/dashboard/get-assigned-forms', [DashboardController::class, 'getAssignedForms'])->name('dashboard.getAssignedForms');
Route::get('/dashboard/get-all-unassigned-guest-forms', [DashboardController::class, 'getAllUnassignedGuestForms'])->name('dashboard.getAllUnassignedGuestForms');


Route::controller(FormController::class)->prefix('admin/form')->name('admin.form.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/create', 'create')->name('create');
        Route::get('/show/{id}', 'show')->name('show');
        Route::post('/store', 'store')->name('store');
        Route::get('/edit/{form}', 'edit')->name('edit');
        Route::post('/update/{form}', 'update')->name('update');
        Route::get('/destroy/{form}', 'delete')->name('delete');
    });

Route::get('/admin', function () {
    return view('admin.dashboard');
})->name('admin.dashboard');


Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '^(?!admin).*');
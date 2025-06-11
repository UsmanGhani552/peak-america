<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');

Route::get('/dashboard/assign-form-to-user', [DashboardController::class, 'assignFormToUser'])->name('dashboard.assignFormToUser');
Route::get('/dashboard/get-assigned-forms', [DashboardController::class, 'getAssignedForms'])->name('dashboard.getAssignedForms');
Route::get('/dashboard/get-all-unassigned-guest-forms', [DashboardController::class, 'getAllUnassignedGuestForms'])->name('dashboard.getAllUnassignedGuestForms');

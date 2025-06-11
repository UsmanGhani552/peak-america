<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FormAssignmentController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\MultiStepFormController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\GuestIdentifier;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register'])->middleware('auth:sanctum', 'role_or_permission:Super Admin');
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

    // Form Assignment APIs
    Route::post('/assign-form-to-user', [FormAssignmentController::class, 'assignFormToUser'])->middleware('role_or_permission:Super Admin||Admin');
    Route::get('/get-assigned-form', [FormAssignmentController::class, 'getAssignedForms'])->middleware('role_or_permission:Super Admin||Admin');
    Route::get('/get-all-unassigned-forms', [FormAssignmentController::class, 'getAllUnassignedGuestForms'])->middleware('role_or_permission:Super Admin||Admin');

    Route::middleware('role_or_permission:Super Admin')
    ->group(function () {
            // Dashboard APIs
            Route::get('/get-all-forms', [MultiStepFormController::class, 'getAllGuestForms']);

            // Roles and Permissions APIs
            Route::get('/get-all-roles', [RoleController::class, 'getRoles']);
            Route::post('/store-role', [RoleController::class, 'store']);
            Route::patch('/update-role', [RoleController::class, 'update']);
            Route::delete('/delete-role', [RoleController::class, 'destroy']);

            Route::get('/get-all-permissions', [PermissionController::class, 'getPermissions']);
            Route::post('/store-permission', [PermissionController::class, 'store']);
            Route::put('/update-permission', [PermissionController::class, 'update']);
            Route::delete('/destroy-permission', [PermissionController::class, 'destroy']);
        });
});


Route::get('/register-guest', [GuestController::class, 'registerGuestUser']);
Route::middleware(GuestIdentifier::class)
    ->group(function () {
        Route::post('/submit-form', [MultiStepFormController::class, 'submitForm']);
        Route::post('/get-form', [MultiStepFormController::class, 'getForm']);
    });

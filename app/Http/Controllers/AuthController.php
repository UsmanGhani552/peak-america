<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use App\Models\User;
use App\Traits\ResponseTrait;
use GuzzleHttp\Psr7\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    use ResponseTrait;

    public function login(Requests\LoginRequest $request)
    {
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = Auth::user();
            $token = $user->createToken('user_token')->plainTextToken;
            $user->roles_name = $user->getRoleNames();
            unset($user->roles);

            return ResponseTrait::success('Login successful', [
                'user' => $user,
                'token' => $token,
            ]);
        }

        return ResponseTrait::error('The provided credentials do not match our records.');
    }

    public function register(Requests\RegisterRequest $request)
    {
        try {
            // Create the user
            DB::beginTransaction();
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            $token = $user->createToken('user_token')->plainTextToken;
            $user->assignRole('user');

            $user->roles_name = $user->getRoleNames();
            unset($user->roles);

            DB::commit();
            return ResponseTrait::success('User registered successfully', [
                'user' => $user,
                'token' => $token,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return ResponseTrait::error('An error occurred due to: '.$e->getMessage(), null, 500);
        }
    }

    //Reset Password
    public function requestPasswordReset(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        // Check if the user exists
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return ResponseTrait::error('We cannot find a user with that email address.', null, 404);
        }

        // Generate a custom token
        $token = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Store the token in the database (e.g., in a password_reset_tokens table)
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            [
                'email' => $user->email,
                'token' => $token,
                'created_at' => now(),
            ]
        );

        // Send the reset link via email
        $emailHandlerController = new EmailHandlerController();
        $emailHandlerController->sendForgetPasswordEmail(new Request([
            'email' => $user->email,
            'token' => $token,
        ]));

        return ResponseTrait::success('Password reset code sent successfully.');
    }
    public function resetPasswordValidateCode(Request $request)
    {
        $request->validate([
            'code' => 'required',
            'email' => 'required|email',
        ]);

        // Validate the token and email
        $resetEntry = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('token', $request->code)
            ->first();

        if (!$resetEntry) {
            return ResponseTrait::error('Invalid or expired code.', null, 400);
        }

        // Check if the code is expired (e.g., valid for 60 minutes)
        if (now()->diffInMinutes($resetEntry->created_at) > 60) {
            return ResponseTrait::error('The reset code has expired.', null, 400);
        }

        // Reset the user's password
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return ResponseTrait::error('Cannot find a user with that email address.', null, 404040);
        }

        return ResponseTrait::success('Code is valid.');
    }
    public function resetPassword(Request $request)
    {
        $request->validate([
            'code' => 'required',
            'email' => 'required|email',
            'password' => 'required|confirmed|min:8',
        ]);

        // Validate the token and email
        $resetEntry = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('token', $request->code)
            ->first();

        if (!$resetEntry) {
            return ResponseTrait::error('Invalid or expired code.', null, 400);
        }

        // Check if the code is expired (e.g., valid for 60 minutes)
        if (now()->diffInMinutes($resetEntry->created_at) > 60) {
            return ResponseTrait::error('The reset code has expired.', null, 400);
        }

        // Reset the user's password
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return ResponseTrait::error('Cannot find a user with that email address.', null, 404040);
        }

        $user->forceFill([
            'password' => Hash::make($request->password),
        ])->save();

        // Invalidate all tokens for the user
        $user->tokens()->delete();

        // Delete the reset code from the database
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return ResponseTrait::success('Password reset successfully.');
    }
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8',
        ]);

        if (!Hash::check($request->current_password, $request->user()->password)) {
            return ResponseTrait::error('Current password is incorrect.', null, 400);
        }

        $request->user()->update([
            'password' => Hash::make($request->new_password),
        ]);

        return ResponseTrait::success('Password changed successfully.');
    }
}

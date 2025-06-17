<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index() {
        $users= User::all();
        return view('admin.user.index', [
            'users' => $users, // Example: paginate users
        ]);
    }

    public function create() {
        return view('admin.user.create');
    }

    public function store(RegisterRequest $request)
    {
        try {
            DB::beginTransaction();
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);
            $user->assignRole('Admin');
            DB::commit();
            return redirect()->route('admin.user.index')->with('success', 'Admin created successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('admin.user.index')->with('error', 'An error occurred due to: '.$e->getMessage());
        }
    }

    public function edit($id) {
        $user = User::findOrFail($id);
        return view('admin.user.edit', compact('user'));
    }

    public function update(RegisterRequest $request, $id) {
        try {
            DB::beginTransaction();
            $user = User::findOrFail($id);
            $user->update([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);
            DB::commit();
            return redirect()->route('admin.user.index')->with('success', 'Admin updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('admin.user.index')->with('error', 'An error occurred due to: '.$e->getMessage());
        }
    }

    public function delete($id) {
        try {
            $user = User::findOrFail($id);
            $user->delete();
            return redirect()->route('admin.user.index')->with('success', 'Admin deleted successfully');
        } catch (\Exception $e) {
            return redirect()->route('admin.user.index')->with('error', 'An error occurred due to: '.$e->getMessage());
        }
    }
}

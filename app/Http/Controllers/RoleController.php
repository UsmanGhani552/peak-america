<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Traits\ResponseTrait;

class RoleController extends Controller
{
    use ResponseTrait;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function getRoles()
    {
        $roles = Role::all();
        return ResponseTrait::success('Roles retrieved successfully', $roles);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate(['name' => 'required']);
        $role = Role::create(['name' => $request->name]);
        if(!$role){
            return ResponseTrait::error('Role failed to failed.');
        }
        // $role->syncPermissions($request->permissions);

        return ResponseTrait::success('Role created !!!');
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Role $role)
    {
        $request->validate([
            'new_name' => 'string',
            'role' => 'array'
        ]);

        if ($request->has('role')) {
            $role->syncPermissions($request->role);
        }

        if ($request->filled('new_name')) {
            $role->name = $request->new_name;
            $role->save();
        }

        return ResponseTrait::success('Role updated !!!');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\Response
     */
    public function destroy(Role $role)
    {
        try {
            $is_deleted = $role->delete();
        } catch (\Throwable $th) {
            return ResponseTrait::error("Role can't be deleted due to {$th->getMessage()}", null, 500);
        }
        if ($is_deleted) {
            return ResponseTrait::success('Role deleted !!!');
        }
        return ResponseTrait::error('Role can\'t be deleted !!!', null, 500);
    }
}

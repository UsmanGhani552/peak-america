<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use App\Traits\ResponseTrait;
use Illuminate\Routing\Controllers\Middleware;
use Spatie\Permission\Middleware\RoleMiddleware;
use Spatie\Permission\Models\Role;

class PermissionController extends Controller
{
    use ResponseTrait;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     *
     */

    public function getPermissions()
    {
        $permissions = Permission::all();
        return ResponseTrait::success('Permissions retrieved successfully', $permissions);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate(['name'=>'required']);
        $permission = Permission::create(['name' => $request->name]);
        if($permission){
            $permission->assignRole('Super Admin');
            return ResponseTrait::success('Permission created.');
        }
        return ResponseTrait::error('Permissions failed to create.');
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Permission  $permission
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $request->validate(['previous_name' => 'required|string', 'new_name' => 'required|string']);
        $permission = Permission::where('name', $request->previous_name)->first();
        if(!$permission){
            return ResponseTrait::error('Permission not found !!!', null, 404);
        }
        $permission->update(['name' => $request->new_name]);
        return ResponseTrait::success('Permission updated !!!');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Permission  $permission
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $request->validate(['name' => 'required']);
        try {
            $permission = Permission::where('name', $request->name)->first();
            $is_deleted = $permission->delete();
        } catch (\Throwable $th) {
            return ResponseTrait::error("Permission can't be deleted due to {$th->getMessage()}", null, 500);
        }
        if($is_deleted){
            return ResponseTrait::success('Permission deleted !!!');
        }
        return ResponseTrait::error('Permission failed to delete.');
    }
}

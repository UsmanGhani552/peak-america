<?php

namespace App\Http\Controllers;

use App\Helpers\FileManager;
use App\Models\User;
use Illuminate\Http\Request;
use App\Enums\StorageFolder;
use App\Http\Requests\ProfilePictureRequest;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use App\Traits\ResponseTrait;
use GuzzleHttp\Psr7\Response;
use Spatie\Permission\Traits\HasRoles;
use Spatie\Permission\Models\Permission;
use App\Http\Controllers\Controller;

use Spatie\Permission\Middlewares\RoleMiddleware;
use Spatie\Permission\Middlewares\PermissionMiddleware;
use Spatie\Permission\Middlewares\RoleOrPermissionMiddleware;

class UserController extends Controller
{
    use ResponseTrait;

    public function __construct(){
        $this->middleware('role_or_permission:Permission view users|Permission create users|Permission edit users|Permission delete users', ['only' => ['getUserProfile']]);
        $this->middleware('role_or_permission:Permission create users', ['only' => ['uploadProfilePic']]);
        $this->middleware('role_or_permission:Permission edit users', ['only' => ['updateUserProfile']]);
        $this->middleware('role_or_permission:Permission delete users', ['only' => ['deleteProfilePic']]);
    }

    public function getUserProfile(Request $request)
    {
        return ResponseTrait::success('User profile retrieved successfully.', $request->user());
    }

    public function updateUserProfile(Request $request)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $request->user()->id,
        ]);

        try {
            $user = $request->user();
            $user->update($request->only('name', 'email', "company_name"));

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully.',
                'data' => $user,
            ]);
            ResponseTrait::success('Profile updated successfully.', $user);
        } catch (\Throwable $th) {
            ResponseTrait::error("Profile can\'t be update due to {$th->getMessage()}", [], 500);
        }

    }

    public function uploadProfilePic(ProfilePictureRequest $request)
    {
        try {

            $user = Auth::user();
            if($user == null) throw new Exception("User not found.");

            $profilePicPath = FileManager::uploadFile($request->file('profile_picture'), StorageFolder::PROFILE_PICTURES);
            if($profilePicPath == null){
                ResponseTrait::error('Can\'t save file.');
            }

            if($user->profile_picture){
                FileManager::deleteFile($user->profile_picture,  StorageFolder::PROFILE_PICTURES);
            }
            $user->profile_picture = $profilePicPath;
            $user->save();
            $user->path = StorageFolder::PROFILE_PICTURES->publicPath();


            return ResponseTrait::success('Profile picture updated successfully', $user);

        } catch (\Throwable $th) {
            return ResponseTrait::error("Profile picture can't be updated due to {$th->getMessage()}", [], 500);
        }
    }
    public function deleteProfilePic(Request $request){
        try {
            $profilePic = FileManager::deleteFile($request->profile_picture,  StorageFolder::PROFILE_PICTURES);
        } catch (\Throwable $th) {
            return ResponseTrait::error("Profile picture can't be deleted due to {$th->getMessage()}", [], 500);
        }

        return ResponseTrait::success('Profile picture deleted successfully.', ['profilePic'=>$profilePic]);
    }
    // public function getUrlProfilePic($profilePicture)
    // {
    //     try {
    //         // Get the file URL using the profile picture name from the URL parameter
    //         $profilePic = FileManager::getFileUrlFromName($profilePicture, StorageFolder::PROFILE_PICTURES);
    //     } catch (\Throwable $th) {
    //         return response()->json(['error' => $th->getMessage()], 500);
    //     }

    //     return response()->json(['profilePic' => $profilePic]);
    // }
}

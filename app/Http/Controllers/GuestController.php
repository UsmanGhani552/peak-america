<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Traits\ResponseTrait;
use GuzzleHttp\Psr7\Response;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class GuestController extends Controller
{
    public function registerGuestUser()
    {
        $uuid = (string) Str::uuid();

        $guest = Guest::firstOrCreate(['uuid' => $uuid]);

        return ResponseTrait::success('Guest data stored successfully', [
            'guest_uuid' => $guest->uuid,
        ]);
    }
}

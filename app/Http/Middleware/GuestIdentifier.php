<?php

namespace App\Http\Middleware;

use App\Models\Guest;
use Closure;
use App\traits\ResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class GuestIdentifier
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->hasHeader('X-Guest-UUID')) {
            $uuid = $request->header('X-Guest-UUID');
            $guest = Guest::where('uuid', $uuid)->first();
            if (Str::isUuid($uuid) && $guest) {
                // Add macros to the request object
                $request::macro('uuid', function () use ($uuid) {
                    return $uuid;
                });
                $request::macro('guest_id', function () use ($guest) {
                    return $guest->id;
                });
                return $next($request);
            }
            return ResponseTrait::error('Guest UUID header is invalid.');
        }
        return ResponseTrait::error('Guest UUID header is missing.');
    }
}

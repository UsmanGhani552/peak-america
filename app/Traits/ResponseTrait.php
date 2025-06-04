<?php
namespace App\Traits;

trait ResponseTrait
{
    public static function success($message = 'Operation successful', $data = [])
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ]);
    }

    public static function error($message = 'An error occurred', $data = null, $statusCode = 400)
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'data' => ['error' => $data? $data: $message],
        ], $statusCode);
    }
}

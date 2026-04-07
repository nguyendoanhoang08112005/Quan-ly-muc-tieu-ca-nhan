<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(private readonly AuthService $authService)
    {
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        $payload = $this->authService->register($request->validated());

        return response()->json([
            'message' => 'Dang ky thanh cong.',
            'user' => UserResource::make($payload['user'])->resolve(),
            'token' => $payload['token'],
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $payload = $this->authService->login($request->validated());

        return response()->json([
            'message' => 'Dang nhap thanh cong.',
            'user' => UserResource::make($payload['user'])->resolve(),
            'token' => $payload['token'],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout(
            $request->user(),
            $request->user()?->currentAccessToken(),
            $request->bearerToken()
        );

        return response()->json([
            'message' => 'Dang xuat thanh cong.',
        ]);
    }

    public function me(Request $request): UserResource
    {
        return new UserResource($request->user());
    }
}

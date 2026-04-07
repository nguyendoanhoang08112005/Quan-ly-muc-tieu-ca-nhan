<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;

class AuthService
{
    public function register(array $data): array
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'timezone' => $data['timezone'] ?? 'Asia/Ho_Chi_Minh',
            'locale' => $data['locale'] ?? 'vi',
        ]);

        return [
            'user' => $user,
            'token' => $user->createToken('auth_token')->plainTextToken,
        ];
    }

    public function login(array $credentials): array
    {
        $user = User::query()->where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Thong tin dang nhap khong dung.'],
            ]);
        }

        return [
            'user' => $user,
            'token' => $user->createToken('auth_token')->plainTextToken,
        ];
    }

    public function logout(User $user, ?object $token, ?string $plainTextToken = null): void
    {
        if ($token) {
            $token->delete();
            return;
        }

        if ($plainTextToken) {
            $accessToken = PersonalAccessToken::findToken($plainTextToken);

            if ($accessToken && (int) $accessToken->tokenable_id === (int) $user->id) {
                $accessToken->delete();
                return;
            }
        }

        $user->tokens()->delete();
    }
}

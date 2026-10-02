<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * Autentica o usuário e retorna os dados + token Sanctum.
     *
     * @throws ValidationException
     */
    public function login(string $email, string $password): array
    {
        $user = User::where('email', $email)->first();

        if (! $user || ! Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Credenciais inválidas.'],
            ]);
        }

        // Revoga tokens antigos para evitar acúmulo
        $user->tokens()->delete();

        $token = $user->createToken('pdv-token')->plainTextToken;

        return [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'token' => $token,
        ];
    }

    /**
     * Revoga o token atual do usuário.
     */
    public function logout(User $user): void
    {
        $user->currentAccessToken()->delete();
    }
}
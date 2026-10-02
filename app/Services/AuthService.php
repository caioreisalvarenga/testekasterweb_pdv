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
     * @param  array{email: string, password: string}  $data
     * @return array{user: array{id: int, name: string, email: string}, token: string}
     *
     * @throws ValidationException
     */
    public function login(array $data): array
    {
        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Credenciais inválidas.'],
            ]);
        }

        // Revoga tokens antigos para evitar acúmulo
        $user->tokens()->delete();

        $token = $user->createToken('pdv-token')->plainTextToken;

        return [
            'user' => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
            ],
            'token' => $token,
        ];
    }

    /**
     * Retorna os dados do usuário autenticado.
     *
     * @return array{id: int, name: string, email: string}
     */
    public function me(User $user): array
    {
        return [
            'id'    => $user->id,
            'name'  => $user->name,
            'email' => $user->email,
        ];
    }

    /**
     * Revoga o token atual do usuário autenticado.
     */
    public function logout(User $user): void
    {
        $user->currentAccessToken()->delete();
    }
}
<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * Autentica o usuário a partir de uma Request HTTP.
     *
     * @throws ValidationException
     */
    public function login(Request $request): array
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Credenciais inválidas.'],
            ]);
        }

        // Revoga tokens antigos (evita acúmulo)
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
     */
    public function me(Request $request): array
    {
        $user = $request->user();

        return [
            'id'    => $user->id,
            'name'  => $user->name,
            'email' => $user->email,
        ];
    }

    /**
     * Revoga o token atual do usuário autenticado.
     */
    public function logout(Request $request): void
    {
        $request->user()->currentAccessToken()->delete();
    }
}
<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Usuário padrão para testes
        User::create([
            'name'     => 'Teste PDV',
            'email'    => 'teste@pdv.com',
            'password' => 'senha123', // cast 'hashed' no Model já hasheia
        ]);

        // Produtos de exemplo
        $this->call([
            ProdutoSeeder::class,
        ]);
    }
}
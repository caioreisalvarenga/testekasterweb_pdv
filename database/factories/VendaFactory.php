<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Venda;
use Illuminate\Database\Eloquent\Factories\Factory;

class VendaFactory extends Factory
{
    protected $model = Venda::class;

    public function definition(): array
    {
        return [
            'user_id'          => User::factory(),
            'total'            => 0,
            'forma_pagamento'  => 'dinheiro',
            'valor_recebido'   => 0,
            'troco'            => 0,
            'status'           => 'finalizada',
        ];
    }
}
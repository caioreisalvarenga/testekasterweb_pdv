<?php

namespace Database\Factories;

use App\Models\Produto;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProdutoFactory extends Factory
{
    protected $model = Produto::class;

    public function definition(): array
    {
        return [
            'nome'       => $this->faker->word(),
            'codigo'     => strtoupper($this->faker->unique()->bothify('???-####')),
            'preco'      => $this->faker->randomFloat(2, 1, 100),
            'disponivel' => true,
            'estoque'    => $this->faker->numberBetween(0, 100),
        ];
    }
}
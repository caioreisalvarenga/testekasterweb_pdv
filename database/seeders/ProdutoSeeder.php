<?php

namespace Database\Seeders;

use App\Models\Produto;
use Illuminate\Database\Seeder;

class ProdutoSeeder extends Seeder
{
    public function run(): void
    {
        $produtos = [
            ['nome' => 'Coca-Cola 350ml',     'codigo' => 'REF001', 'preco' => 5.50,  'estoque' => 50],
            ['nome' => 'Pepsi 350ml',         'codigo' => 'REF002', 'preco' => 5.00,  'estoque' => 40],
            ['nome' => 'Água Mineral 500ml',  'codigo' => 'AGU001', 'preco' => 3.00,  'estoque' => 100],
            ['nome' => 'Cerveja Heineken',    'codigo' => 'CER001', 'preco' => 12.90, 'estoque' => 30],
            ['nome' => 'Salgado Assado',      'codigo' => 'SAL001', 'preco' => 8.00,  'estoque' => 20],
            ['nome' => 'Pão de Queijo',       'codigo' => 'SAL002', 'preco' => 4.50,  'estoque' => 25],
            ['nome' => 'Chocolate Barra',     'codigo' => 'DOC001', 'preco' => 6.50,  'estoque' => 60],
            ['nome' => 'Bala de Hortelã',     'codigo' => 'DOC002', 'preco' => 1.50,  'estoque' => 200],
            ['nome' => 'Café Expresso',       'codigo' => 'CAF001', 'preco' => 7.00,  'estoque' => 0],
            ['nome' => 'Suco de Laranja',     'codigo' => 'SUC001', 'preco' => 9.90,  'estoque' => 15],
        ];

        foreach ($produtos as $produto) {
            Produto::create($produto);
        }

        // Um produto indisponível para testar a regra de negócio
        Produto::create([
            'nome'       => 'Produto Descontinuado',
            'codigo'     => 'OFF001',
            'preco'      => 10.00,
            'disponivel' => false,
            'estoque'    => 0,
        ]);
    }
}
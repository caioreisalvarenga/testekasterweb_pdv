<?php

namespace App\Services;

use App\Models\Produto;
use App\Models\User;
use App\Models\Venda;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class VendaService
{
    /**
     * Cria uma nova venda aplicando todas as regras de negócio.
     *
     * @throws ValidationException
     */
    public function criar(array $data, User $user): Venda
    {
        return DB::transaction(function () use ($data, $user) {
            $itens = $this->prepararItens($data['itens']);

            $total = collect($itens)->sum('subtotal');
            $total = round($total, 2);

            // Regras de pagamento em dinheiro
            $valorRecebido = null;
            $troco = null;

            if ($data['forma_pagamento'] === 'dinheiro') {
                if (!isset($data['valor_recebido'])) {
                    throw ValidationException::withMessages([
                        'valor_recebido' => ['Informe o valor recebido para pagamento em dinheiro.'],
                    ]);
                }

                $valorRecebido = round((float) $data['valor_recebido'], 2);

                if ($valorRecebido < $total) {
                    throw ValidationException::withMessages([
                        'valor_recebido' => ['O valor recebido não pode ser menor que o total da venda.'],
                    ]);
                }

                $troco = round($valorRecebido - $total, 2);
            }

            // Cria a venda
            $venda = Venda::create([
                'user_id'          => $user->id,
                'total'            => $total,
                'forma_pagamento'  => $data['forma_pagamento'],
                'valor_recebido'   => $valorRecebido,
                'troco'            => $troco,
                'status'           => 'finalizada',
            ]);

            // Cria os itens
            foreach ($itens as $item) {
                $venda->itens()->create($item);
            }

            return $venda->load('itens.produto', 'user');
        });
    }

    /**
     * Prepara os itens com preço congelado e valida disponibilidade.
     *
     * @throws ValidationException
     */
    private function prepararItens(array $itensRequest): array
    {
        $itensPreparados = [];

        foreach ($itensRequest as $item) {
            $produto = Produto::find($item['produto_id']);

            if (!$produto) {
                throw ValidationException::withMessages([
                    'itens' => ["Produto ID {$item['produto_id']} não encontrado."],
                ]);
            }

            if (!$produto->disponivel) {
                throw ValidationException::withMessages([
                    'itens' => ["O produto '{$produto->nome}' não está disponível para venda."],
                ]);
            }

            $quantidade    = (int) $item['quantidade'];
            $precoUnitario = (float) $produto->preco;
            $subtotal      = round($precoUnitario * $quantidade, 2);

            $itensPreparados[] = [
                'produto_id'     => $produto->id,
                'quantidade'     => $quantidade,
                'preco_unitario' => $precoUnitario,
                'subtotal'       => $subtotal,
            ];
        }

        return $itensPreparados;
    }

    /**
     * Lista vendas (opcional: filtrar por data).
     */
    public function listar(?string $data = null)
    {
        return Venda::with('itens.produto', 'user')
            ->when($data, fn ($q) => $q->whereDate('created_at', $data))
            ->orderByDesc('id')
            ->get();
    }

    public function buscar(int $id): Venda
    {
        return Venda::with('itens.produto', 'user')->findOrFail($id);
    }
}
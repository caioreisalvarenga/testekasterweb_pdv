<?php

namespace App\Services;

use App\Models\Produto;
use Illuminate\Database\Eloquent\Collection;

class ProdutoService
{
    /**
     * Lista produtos, opcionalmente filtrando por nome ou código.
     */
    public function listar(?string $busca = null): Collection
    {
        return Produto::query()
            ->when($busca, fn ($q) => $q->busca($busca))
            ->orderBy('nome')
            ->get();
    }

    /**
     * Lista apenas produtos disponíveis (para o PDV).
     */
    public function listarDisponiveis(?string $busca = null): Collection
    {
        return Produto::query()
            ->disponiveis()
            ->when($busca, fn ($q) => $q->busca($busca))
            ->orderBy('nome')
            ->get();
    }

    public function buscar(int $id): Produto
    {
        return Produto::findOrFail($id);
    }

    public function criar(array $data): Produto
    {
        return Produto::create($data);
    }

    public function atualizar(Produto $produto, array $data): Produto
    {
        $produto->update($data);
        return $produto->fresh();
    }

    public function excluir(Produto $produto): void
    {
        $produto->delete();
    }
}
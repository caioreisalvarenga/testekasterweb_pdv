<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProdutoRequest;
use App\Http\Requests\UpdateProdutoRequest;
use App\Models\Produto;
use App\Services\ProdutoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProdutoController extends Controller
{
    public function __construct(private ProdutoService $produtoService) {}

    /**
     * Lista produtos. Aceita ?busca=xxx e ?disponiveis=1
     */
    public function index(Request $request): JsonResponse
    {
        $busca = $request->query('busca');
        $somenteDisponiveis = $request->boolean('disponiveis');

        $produtos = $somenteDisponiveis
            ? $this->produtoService->listarDisponiveis($busca)
            : $this->produtoService->listar($busca);

        return response()->json($produtos);
    }

    public function store(StoreProdutoRequest $request): JsonResponse
    {
        $produto = $this->produtoService->criar($request->validated());
        return response()->json($produto, 201);
    }

    public function show(Produto $produto): JsonResponse
    {
        return response()->json($produto);
    }

    public function update(UpdateProdutoRequest $request, Produto $produto): JsonResponse
    {
        $produto = $this->produtoService->atualizar($produto, $request->validated());
        return response()->json($produto);
    }

    public function destroy(Produto $produto): JsonResponse
    {
        $this->produtoService->excluir($produto);
        return response()->json(['message' => 'Produto removido com sucesso.']);
    }
}
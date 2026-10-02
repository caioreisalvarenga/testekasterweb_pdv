<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVendaRequest;
use App\Models\Venda;
use App\Services\VendaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VendaController extends Controller
{
    public function __construct(private VendaService $vendaService) {}

    public function index(Request $request): JsonResponse
    {
        $data = $request->query('data'); // opcional: ?data=2026-02-27
        return response()->json($this->vendaService->listar($data));
    }

    public function store(StoreVendaRequest $request): JsonResponse
    {
        $venda = $this->vendaService->criar(
            $request->validated(),
            $request->user()
        );

        return response()->json($venda, 201);
    }

    public function show(Venda $venda): JsonResponse
    {
        return response()->json($venda->load('itens.produto', 'user'));
    }
}
<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

// Rotas públicas
Route::post('/login', [AuthController::class, 'login']);

// Rotas protegidas (exigem token)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Futuras rotas do PDV ficarão aqui dentro
    // Route::apiResource('produtos', ProdutoController::class);
    // Route::apiResource('vendas', VendaController::class);
});
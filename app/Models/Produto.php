<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produto extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'codigo',
        'preco',
        'disponivel',
        'estoque',
    ];

    protected function casts(): array
    {
        return [
            'preco'      => 'decimal:2',
            'disponivel' => 'boolean',
            'estoque'    => 'integer',
        ];
    }

    /**
     * Scope: busca por nome ou código.
     */
    public function scopeBusca($query, string $termo)
    {
        return $query->where(function ($q) use ($termo) {
            $q->where('nome', 'like', "%{$termo}%")
              ->orWhere('codigo', 'like', "%{$termo}%");
        });
    }

    /**
     * Scope: só produtos disponíveis.
     */
    public function scopeDisponiveis($query)
    {
        return $query->where('disponivel', true);
    }
}
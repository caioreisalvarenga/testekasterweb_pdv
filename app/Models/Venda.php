<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Venda extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'total',
        'forma_pagamento',
        'valor_recebido',
        'troco',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'total'          => 'decimal:2',
            'valor_recebido' => 'decimal:2',
            'troco'          => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function itens(): HasMany
    {
        return $this->hasMany(ItemVenda::class);
    }
}
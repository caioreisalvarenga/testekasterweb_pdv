<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVendaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'forma_pagamento'      => ['required', 'in:dinheiro,cartao_credito,cartao_debito,pix'],
            'valor_recebido'       => ['nullable', 'numeric', 'min:0'],
            'itens'                => ['required', 'array', 'min:1'],
            'itens.*.produto_id'   => ['required', 'integer', 'exists:produtos,id'],
            'itens.*.quantidade'   => ['required', 'integer', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'forma_pagamento.required' => 'A forma de pagamento é obrigatória.',
            'forma_pagamento.in'       => 'Forma de pagamento inválida.',
            'itens.required'           => 'A venda precisa ter pelo menos 1 item.',
            'itens.min'                => 'A venda precisa ter pelo menos 1 item.',
            'itens.*.produto_id.exists'=> 'Produto não encontrado.',
            'itens.*.quantidade.min'   => 'A quantidade deve ser no mínimo 1.',
        ];
    }
}
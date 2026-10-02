<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProdutoRequest extends FormRequest
{
    /**
     * Autoriza a requisição. A rota já está protegida por auth:sanctum.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Regras de validação para atualizar um produto.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        // Pega o ID do produto que está sendo editado (Route Model Binding)
        $produtoId = $this->route('produto');

        return [
            'nome'       => ['required', 'string', 'max:255'],
            'codigo'     => [
                'required',
                'string',
                'max:50',
                Rule::unique('produtos', 'codigo')->ignore($produtoId),
            ],
            'preco'      => ['required', 'numeric', 'min:0'],
            'disponivel' => ['sometimes', 'boolean'],
            'estoque'    => ['sometimes', 'integer', 'min:0'],
        ];
    }

    /**
     * Mensagens customizadas (opcional).
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nome.required'    => 'O nome é obrigatório.',
            'codigo.required'  => 'O código é obrigatório.',
            'codigo.unique'    => 'Este código já está em uso.',
            'preco.required'   => 'O preço é obrigatório.',
            'preco.numeric'    => 'O preço deve ser um número.',
            'preco.min'        => 'O preço não pode ser negativo.',
            'estoque.integer'  => 'O estoque deve ser um número inteiro.',
            'estoque.min'      => 'O estoque não pode ser negativo.',
        ];
    }
}
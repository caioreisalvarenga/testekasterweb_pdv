<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProdutoRequest extends FormRequest
{
    /**
     * Autoriza a requisição. A rota já está protegida por auth:sanctum.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Regras de validação para criar um produto.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'nome'       => ['required', 'string', 'max:255'],
            'codigo'     => ['required', 'string', 'max:50', 'unique:produtos,codigo'],
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
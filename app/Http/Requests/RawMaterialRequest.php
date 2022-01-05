<?php

namespace App\Http\Requests;

use App\Models\RawMaterial;
use Illuminate\Foundation\Http\FormRequest;

class RawMaterialRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name'        => ['required', 'string', 'max:128'],
            'slug'        => ['required', 'unique:raw_materials', 'string', 'max:128'],
            'description' => ['required', 'string'],
            'stock'       => ['required', 'integer'],
            'barcode'     => ['nullable', 'string'],
            'type'        => ['nullable', 'integer'],
            'status'      => ['required', 'integer'],
            'unit_id'     => ['required', 'integer'],
            'shop_id'     => ['required', 'integer'],
        ];;
    }

    public function attributes()
    {
        return [
            'name'        => 'Nome',
            'slug'        => 'Slug',
            'description' => 'Descrição',
            'stock'       => 'Stock',
            'barcode'     => 'Codigo de barras',
            'type'        => 'Tipo',
            'status'      => 'Status',
            'unit_id'     => 'Unidad',
            'shop_id'     => 'Loja',
        ];
    }
}
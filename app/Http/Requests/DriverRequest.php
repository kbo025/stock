<?php

namespace App\Http\Requests;

use App\Models\Driver;
use Illuminate\Foundation\Http\FormRequest;

class DriverRequest extends FormRequest
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
            'rg' => ['required', 'unique:drivers', 'string', 'max:12'],
            'cpf' => ['required', 'unique:drivers', 'string', 'max:12'],
            'first_name' => ['required', 'string', 'max:56'],
            'last_name' => ['required', 'string', 'max:56'],
            'phone' => ['nullable', 'string', 'max:12'],
            'address' => ['nullable', 'string', 'max:128'],
            'status_id' => ['required', 'integer'],
        ];
    }

    public function attributes()
    {
        return [
            'rg' => 'RG',
            'cpf' => 'CPF',
            'first_name' => 'Nome',
            'last_name' => 'Sobrenome',
            'password' => 'Senha',
            'phone' => 'Telefone',
            'address' => 'Endereço',
            'status_id' => 'Sttaus',
        ];
    }
}
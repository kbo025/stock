<?php

namespace App\Http\Requests;

use App\Models\Vehicle;
use Illuminate\Foundation\Http\FormRequest;

class VehicleRequest extends FormRequest
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
            'brand' => ['required', 'string', 'max:56'],
            'model' => ['required', 'string', 'max:56'],
            'color' => ['required', 'string', 'max:56'],
            'year' => ['required', 'string', 'max:4'],
            'plate' => ['required', 'unique:vehicles', 'string', 'max:8'],
            'status_id' => ['required', 'integer'],
            'driver_id' => ['nullable', 'integer'],
            'renavam' => ['nullanbe', 'unique:vehicles', 'string'],
            'chassi' => ['nullanbe', 'unique:vehicles', 'string'],
            'motor' => ['nullanbe', 'unique:vehicles', 'string'],
            'fuel_type_id' => ['nullanbe', 'integer'],
        ];
    }

    public function attributes()
    {
        return [
            'brand' => 'Marca',
            'model' => 'Modelo',
            'color' => 'Cor',
            'year' => 'Ano',
            'plate' => 'Placa',
            'status_id' => 'Status',
            'driver_id' => 'Motorista',
            'renavam' => 'RENAVAM',
            'chassi' => 'Chassi',
            'motor' => 'Número Motor',
            'fuel_type_id' => 'Combustivel',
        ];
    }
}
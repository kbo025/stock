<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\VehicleRequest; //TODO
use App\Http\Controllers\BackendController;
use App\Models\Vehicle;
use Yajra\Datatables\Datatables;

class VehicleController extends BackendController
{
    public function __construct()
    {
        $this->data['siteTitle'] = 'Veiculos';

        $this->middleware(['permission:vehicles'])->only('index');
        $this->middleware(['permission:vehicles_create'])->only('create', 'store');
        $this->middleware(['permission:vehicles_edit'])->only('edit', 'update');
        $this->middleware(['permission:vehicles_delete'])->only('destroy');
        $this->middleware(['permission:vehicles_show'])->only('show');
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('admin.vehicle.index', $this->data);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('admin.vehicle.create', $this->data);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store( VehicleRequest $request)
    {
        $vehicle             = new Vehicle;

        $vehicle->brand        = strip_tags($request->brand);
        $vehicle->model        = strip_tags($request->model);
        $vehicle->color        = strip_tags($request->color);
        $vehicle->year         = strip_tags($request->year);
        $vehicle->plate        = strip_tags($request->plate);
        $vehicle->status_id    = strip_tags($request->status_id);
        $vehicle->driver_id    = strip_tags($request->driver_id);
        $vehicle->renavam      = strip_tags($request->renavam);
        $vehicle->chassi       = strip_tags($request->chassi);
        $vehicle->motor        = strip_tags($request->motor);
        $vehicle->fuel_type_id = strip_tags($request->fuel_type_id);

        $vehicle->save();

        return redirect(route('admin.vehicle.index'))->withSuccess('Veiculo registrado com sucesso');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $this->data['vehicle'] = Vehicle::findOrFail($id);
        return view('admin.vehicle.show', $this->data);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $this->data['vehicle'] = Vehicle::findOrFail($id);
        return view('admin.vehicle.edit', $this->data);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update( VehicleRequest $request, $id)
    {
        $vehicle = Vehicle::findOrFail($id);

        $vehicle->brand        = strip_tags($request->brand);
        $vehicle->model        = strip_tags($request->model);
        $vehicle->color        = strip_tags($request->color);
        $vehicle->year         = strip_tags($request->year);
        $vehicle->plate        = strip_tags($request->plate);
        $vehicle->status_id    = strip_tags($request->status_id);
        $vehicle->driver_id    = strip_tags($request->driver_id);
        $vehicle->renavam      = strip_tags($request->renavam);
        $vehicle->chassi       = strip_tags($request->chassi);
        $vehicle->motor        = strip_tags($request->motor);
        $vehicle->fuel_type_id = strip_tags($request->fuel_type_id);

        $vehicle->save();

        return redirect(route('admin.vehicle.index'))->withSuccess('Dados atualizados com sucesso');

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $vehicle = Vehicle::findOrFail($id);
        if ((auth()->id() == 1)) {
            $vehicle->delete();
            return redirect(route('admin.vehicle.index'))->withSuccess('Registro removido com sucesso');
        }
    }

    public function getVehicles()
    {
        $models     = Vehicle::latest()->get();
        $modelArray = [];

        if (!blank($models)) {
            foreach ($models as $i => $model) {
                $modelArray[$i + 1]          = $model;
                $modelArray[$i + 1]['setID'] = $i + 1;
            }
        }

        return Datatables::of($modelArray)
            ->addColumn('action', function ($model) {
                $retAction ='';

                if(auth()->user()->can('vehicles_show')) {
                    $retAction .= '<a href="' . route('admin.vehicles.show', $product) . '" class="btn btn-sm btn-icon mr-2  float-left btn-info" data-toggle="tooltip" data-placement="top" title="View"><i class="far fa-eye"></i></a>';
                }

                if(auth()->user()->can('vehicles_edit')) {
                    $retAction .= '<a href="' . route('admin.vehicles.edit', $product) . '" class="btn btn-sm btn-icon float-left btn-primary" data-toggle="tooltip" data-placement="top" title="Edit"> <i class="far fa-edit"></i></a>';
                }

                if(auth()->user()->can('vehicles_delete')) {
                    $retAction .= '<form class="float-left pl-2" action="' . route('admin.vehicles.destroy', $product). '" method="POST">' . method_field('DELETE') . csrf_field() . '<button class="btn btn-sm btn-icon btn-danger" data-toggle="tooltip" data-placement="top" title="Delete"> <i class="fa fa-trash"></i></button></form>';
                }

                return $retAction;
            })
            ->editColumn('brand', function ($model) {
                return $model->brand;
            })
            ->editColumn('model', function ($model) {
                return $model->model;
            })
            ->editColumn('color', function ($model) {
                return $model->color;
            })
            ->editColumn('year', function ($model) {
                return $model->year;
            })
            ->editColumn('plate', function ($model) {
                return $model->plate;
            })
            ->editColumn('status_id', function ($model) {
                return $model->status_id;
            })
            ->editColumn('driver_id', function ($model) {
                return $model->driver_id;
            })
            ->editColumn('renavam', function ($model) {
                return $model->renavam;
            })
            ->editColumn('chassi', function ($model) {
                return $model->chassi;
            })
            ->editColumn('motor', function ($model) {
                return $model->motor;
            })
            ->editColumn('fuel_type_id', function ($model) {
                return $model->fuel_type_id;
            })
            ->editColumn('id', function ($model) {
                return $model->setID;
            })
            ->escapeColumns([])
            ->make(true);
    }
}

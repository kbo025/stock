<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\VehicleRequest; //TODO
use App\Http\Controllers\BackendController;
use App\Models\Vehicle;

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
        return view('admin.vehicles.index', $this->data);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('admin.vehicles.create', $this->data);
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
        // $user->first_name = strip_tags($request->first_name);
        // $user->last_name  = strip_tags($request->last_name);
        // $user->email      =strip_tags( $request->email);
        // $user->username   =strip_tags( $request->username ?? $this->username($request->email));
        // $user->password   = Hash::make(strip_tags(request('password')));
        // $user->phone      = strip_tags($request->phone);
        // $user->address    = strip_tags($request->address);
        // $user->status     = $request->status;
        $vehicle->save();


        return redirect(route('admin.vehicles.index'))->withSuccess('Veiculo registrado com sucesso');
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
        return view('admin.vehicles.show', $this->data);
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
        return view('admin.vehicles.edit', $this->data);
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
        // $vehicle->first_name = strip_tags($request->first_name);
        // $vehicle->last_name  = strip_tags($request->last_name);
        // $vehicle->email      = strip_tags($request->email);
        // $vehicle->username   = strip_tags($request->username ?? $this->username($request->email));
        // $vehicle->phone      = strip_tags($request->phone);
        // $vehicle->address    = strip_tags($request->address);
        $vehicle->save();

        return redirect(route('admin.vehicles.index'))->withSuccess('Dados atualizados com sucesso');

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
            return redirect(route('admin.vehicles.index'))->withSuccess('Registro eliminado com sucesso');
        }
    }

    // public function getAdministrators()
    // {
    //     $role           = Role::find(1);
    //     $roleTow        = Role::find(4);
    //     $users     = User::role([$role->name,$roleTow->name])->latest()->get();
    //     $userArray = [];

    //     $i = 1;
    //     if (!blank($users)) {
    //         foreach ($users as $user) {
    //             $userArray[$i]          = $user;
    //             $userArray[$i]['setID'] = $i;
    //             $i++;
    //         }
    //     }
    //     return Datatables::of($userArray)
    //         ->addColumn('action', function ($user) {
    //             $retAction = '';
    //             if (($user->id == auth()->id()) && (auth()->id() == 1)) {
    //                 if (auth()->user()->can('drivers_show')) {
    //                     $retAction .= '<a href="' . route('admin.vehicles.show', $user) . '" class="btn btn-sm btn-icon float-left btn-info" data-toggle="tooltip" data-placement="top" title="View"><i class="far fa-eye"></i></a>';
    //                 }

    //                 if (auth()->user()->can('drivers_edit')) {
    //                     $retAction .= '<a href="' . route('admin.vehicles.edit', $user) . '" class="btn btn-sm btn-icon float-left btn-primary ml-2" data-toggle="tooltip" data-placement="top" title="Edit"><i class="far fa-edit"></i></a>';
    //                 }
    //             } else if (auth()->id() == 1) {
    //                 if (auth()->user()->can('drivers_show')) {
    //                     $retAction .= '<a href="' . route('admin.vehicles.show', $user) . '" class="btn btn-sm btn-icon float-left btn-info" data-toggle="tooltip" data-placement="top" title="View"><i class="far fa-eye"></i></a>';
    //                 }

    //                 if (auth()->user()->can('drivers_edit')) {
    //                     $retAction .= '<a href="' . route('admin.vehicles.edit', $user) . '" class="btn btn-sm btn-icon float-left btn-primary ml-2" data-toggle="tooltip" data-placement="top" title="Edit"><i class="far fa-edit"></i></a>';
    //                 }

    //                 if (auth()->user()->can('drivers_delete')) {
    //                     $retAction .= '<form class="float-left pl-2" action="' . route('admin.vehicles.destroy', $user) . '" method="POST">' . method_field('DELETE') . csrf_field() . '<button class="btn btn-sm btn-icon btn-danger" data-toggle="tooltip" data-placement="top" title="Delete"><i class="fa fa-trash"></i></button></form>';
    //                 }
    //             } else {
    //                 if ($user->id == 1) {
    //                     if (auth()->user()->can('drivers_show')) {
    //                         $retAction .= '<a href="' . route('admin.vehicles.show', $user) . '" class="btn btn-sm btn-icon float-left btn-info" data-toggle="tooltip" data-placement="top" title="View"><i class="far fa-eye"></i></a>';
    //                     }
    //                 } else {
    //                     if (auth()->user()->can('drivers_show')) {
    //                         $retAction .= '<a href="' . route('admin.vehicles.show', $user) . '" class="btn btn-sm btn-icon float-left btn-info" data-toggle="tooltip" data-placement="top" title="View"><i class="far fa-eye"></i></a>';
    //                     }

    //                     if (auth()->user()->can('drivers_edit')) {
    //                         $retAction .= '<a href="' . route('admin.vehicles.edit', $user) . '" class="btn btn-sm btn-icon float-left btn-primary ml-2"><i class="far fa-edit"></i></a>';
    //                     }
    //                 }
    //             }

    //             return $retAction;
    //         })
    //         ->addColumn('image', function ($user) {
    //             return '<figure class="avatar mr-2"><img src="' . $user->images . '" alt=""></figure>';
    //         })
    //         ->addColumn('name', function ($user) {
    //             return $user->name;
    //         })
    //         ->addColumn('role', function ($user) {
    //             return $user->getrole->name;
    //         })
    //         ->editColumn('id', function ($user) {
    //             return $user->setID;
    //         })
    //         ->escapeColumns([])
    //         ->make(true);
    // }

    // private function username($email)
    // {
    //     $emails = explode('@', $email);
    //     return $emails[0] . mt_rand();
    // }
}

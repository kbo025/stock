<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\RawMaterialRequest; //TODO
use App\Http\Controllers\BackendController;
use App\Models\RawMaterial;

class RawMaterialController extends BackendController
{
    public function __construct()
    {
        $this->data['siteTitle'] = 'Peças e Materia Prima';

        $this->middleware(['permission:raw_material'])->only('index');
        $this->middleware(['permission:raw_material_create'])->only('create', 'store');
        $this->middleware(['permission:raw_material_edit'])->only('edit', 'update');
        $this->middleware(['permission:raw_material_delete'])->only('destroy');
        $this->middleware(['permission:raw_material_show'])->only('show');
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('admin.raw_materials.index', $this->data);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('admin.raw_materials.create', $this->data);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store( RawMaterialRequest $request)
    {
        $rawMaterial             = new RawMaterial;
        // $user->first_name = strip_tags($request->first_name);
        // $user->last_name  = strip_tags($request->last_name);
        // $user->email      =strip_tags( $request->email);
        // $user->username   =strip_tags( $request->username ?? $this->username($request->email));
        // $user->password   = Hash::make(strip_tags(request('password')));
        // $user->phone      = strip_tags($request->phone);
        // $user->address    = strip_tags($request->address);
        // $user->status     = $request->status;
        $rawMaterial->save();


        return redirect(route('admin.raw_materials.index'))->withSuccess('Registro criado com sucesso');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $this->data['raw_materail'] = RawMaterial::findOrFail($id);
        return view('admin.raw_materials.show', $this->data);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $this->data['raw_materail'] = RawMaterial::findOrFail($id);
        return view('admin.raw_materials.edit', $this->data);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update( RawMaterialRequest $request, $id)
    {
        $rawMaterial             = new RawMaterial;
        // $user->first_name = strip_tags($request->first_name);
        // $user->last_name  = strip_tags($request->last_name);
        // $user->email      =strip_tags( $request->email);
        // $user->username   =strip_tags( $request->username ?? $this->username($request->email));
        // $user->password   = Hash::make(strip_tags(request('password')));
        // $user->phone      = strip_tags($request->phone);
        // $user->address    = strip_tags($request->address);
        // $user->status     = $request->status;
        $rawMaterial->save();

        return redirect(route('admin.raw_materials.index'))->withSuccess('Registro atualizado com sucesso');

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $driver = RawMaterial::findOrFail($id);
        if ((auth()->id() == 1)) {
            $driver->delete();
            return redirect(route('admin.raw_materials.index'))->withSuccess('Registro removido com sucesso');
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
    //                     $retAction .= '<a href="' . route('admin.raw_materials.show', $user) . '" class="btn btn-sm btn-icon float-left btn-info" data-toggle="tooltip" data-placement="top" title="View"><i class="far fa-eye"></i></a>';
    //                 }

    //                 if (auth()->user()->can('drivers_edit')) {
    //                     $retAction .= '<a href="' . route('admin.raw_materials.edit', $user) . '" class="btn btn-sm btn-icon float-left btn-primary ml-2" data-toggle="tooltip" data-placement="top" title="Edit"><i class="far fa-edit"></i></a>';
    //                 }
    //             } else if (auth()->id() == 1) {
    //                 if (auth()->user()->can('drivers_show')) {
    //                     $retAction .= '<a href="' . route('admin.raw_materials.show', $user) . '" class="btn btn-sm btn-icon float-left btn-info" data-toggle="tooltip" data-placement="top" title="View"><i class="far fa-eye"></i></a>';
    //                 }

    //                 if (auth()->user()->can('drivers_edit')) {
    //                     $retAction .= '<a href="' . route('admin.raw_materials.edit', $user) . '" class="btn btn-sm btn-icon float-left btn-primary ml-2" data-toggle="tooltip" data-placement="top" title="Edit"><i class="far fa-edit"></i></a>';
    //                 }

    //                 if (auth()->user()->can('drivers_delete')) {
    //                     $retAction .= '<form class="float-left pl-2" action="' . route('admin.raw_materials.destroy', $user) . '" method="POST">' . method_field('DELETE') . csrf_field() . '<button class="btn btn-sm btn-icon btn-danger" data-toggle="tooltip" data-placement="top" title="Delete"><i class="fa fa-trash"></i></button></form>';
    //                 }
    //             } else {
    //                 if ($user->id == 1) {
    //                     if (auth()->user()->can('drivers_show')) {
    //                         $retAction .= '<a href="' . route('admin.raw_materials.show', $user) . '" class="btn btn-sm btn-icon float-left btn-info" data-toggle="tooltip" data-placement="top" title="View"><i class="far fa-eye"></i></a>';
    //                     }
    //                 } else {
    //                     if (auth()->user()->can('drivers_show')) {
    //                         $retAction .= '<a href="' . route('admin.raw_materials.show', $user) . '" class="btn btn-sm btn-icon float-left btn-info" data-toggle="tooltip" data-placement="top" title="View"><i class="far fa-eye"></i></a>';
    //                     }

    //                     if (auth()->user()->can('drivers_edit')) {
    //                         $retAction .= '<a href="' . route('admin.raw_materials.edit', $user) . '" class="btn btn-sm btn-icon float-left btn-primary ml-2"><i class="far fa-edit"></i></a>';
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

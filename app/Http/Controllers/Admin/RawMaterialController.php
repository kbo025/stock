<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\RawMaterialRequest; //TODO
use App\Http\Controllers\BackendController;
use App\Models\RawMaterial;
use Yajra\Datatables\Datatables;

class RawMaterialController extends BackendController
{
    public function __construct()
    {
        $this->data['siteTitle'] = 'Peças e Materia Prima';

        $this->middleware(['permission:materials'])->only('index');
        $this->middleware(['permission:materials_create'])->only('create', 'store');
        $this->middleware(['permission:materials_edit'])->only('edit', 'update');
        $this->middleware(['permission:materials_delete'])->only('destroy');
        $this->middleware(['permission:materials_show'])->only('show');
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('admin.materials.index', $this->data);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('admin.materials.create', $this->data);
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


        return redirect(route('admin.materials.index'))->withSuccess('Registro criado com sucesso');
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
        return view('admin.materials.show', $this->data);
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
        return view('admin.materials.edit', $this->data);
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

        return redirect(route('admin.materials.index'))->withSuccess('Registro atualizado com sucesso');

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
            return redirect(route('admin.materials.index'))->withSuccess('Registro removido com sucesso');
        }
    }

    public function getMaterials()
    {
        $modelArray = [];

        // $i = 1;
        // if (!blank($users)) {
        //     foreach ($users as $user) {
        //         $userArray[$i]          = $user;
        //         $userArray[$i]['setID'] = $i;
        //         $i++;
        //     }
        // }
        return Datatables::of($modelArray)
            ->escapeColumns([])
            ->make(true);
    }
}

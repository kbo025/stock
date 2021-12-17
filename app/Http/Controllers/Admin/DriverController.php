<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\DriverRequest; //TODO
use App\Http\Controllers\BackendController;
use Yajra\Datatables\Datatables;
use App\Models\Driver;

class DriverController extends BackendController
{
    public function __construct()
    {
        $this->data['siteTitle'] = 'Motoristas';

        $this->middleware(['permission:drivers'])->only('index');
        $this->middleware(['permission:drivers_create'])->only('create', 'store');
        $this->middleware(['permission:drivers_edit'])->only('edit', 'update');
        $this->middleware(['permission:drivers_delete'])->only('destroy');
        $this->middleware(['permission:drivers_show'])->only('show');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('admin.drivers.index', $this->data);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('admin.drivers.create', $this->data);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store( DriverRequest $request)
    {
        $driver             = new Driver;
        // $user->first_name = strip_tags($request->first_name);
        // $user->last_name  = strip_tags($request->last_name);
        // $user->email      =strip_tags( $request->email);
        // $user->username   =strip_tags( $request->username ?? $this->username($request->email));
        // $user->password   = Hash::make(strip_tags(request('password')));
        // $user->phone      = strip_tags($request->phone);
        // $user->address    = strip_tags($request->address);
        // $user->status     = $request->status;
        $driver->save();


        return redirect(route('admin.drivers.index'))->withSuccess('Motorista registrado com sucesso');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $this->data['driver'] = Driver::findOrFail($id);
        return view('admin.drivers.show', $this->data);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $this->data['driver'] = Driver::findOrFail($id);
        return view('admin.drivers.edit', $this->data);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update( DriverRequest $request, $id)
    {
        $driver = Driver::findOrFail($id);
        // $driver->first_name = strip_tags($request->first_name);
        // $driver->last_name  = strip_tags($request->last_name);
        // $driver->email      = strip_tags($request->email);
        // $driver->username   = strip_tags($request->username ?? $this->username($request->email));
        // $driver->phone      = strip_tags($request->phone);
        // $driver->address    = strip_tags($request->address);
        $driver->save();

        return redirect(route('admin.drivers.index'))->withSuccess('The Data Updated Successfully');

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $driver = Driver::findOrFail($id);
        if ((auth()->id() == 1)) {
            $driver->delete();
            return redirect(route('admin.drivers.index'))->withSuccess('The Data Deleted Successfully');
        }
    }

    public function getDrivers()
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

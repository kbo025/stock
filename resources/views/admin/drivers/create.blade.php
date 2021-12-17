@extends('admin.layouts.master')

@section('main-content')

	<section class="section">
        <div class="section-header">
            <h1>Motoristas</h1>
            {{ Breadcrumbs::render('drivers/add') }}
        </div>

        <div class="section-body">
        	<div class="row">
	   			<div class="col-12 col-md-6 col-lg-6">
				    <div class="card">

					</div>
				</div>
			</div>
        </div>
    </section>

@endsection

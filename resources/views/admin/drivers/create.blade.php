@extends('admin.layouts.master')

@section('main-content')

	<section class="section">
        <div class="section-header">
            <h1>Motoristas</h1>
            {{ Breadcrumbs::render('drivers/add') }}
        </div>

        <div class="section-body">
        	<div class="row">
                <div class="col-12 col-md-12 col-lg-12">
				    <div class="card">
                        <form action="{{ route('admin.drivers.store') }}" method="POST" enctype="multipart/form-data">
                            @csrf
                            <div class="card">
                                <div class="card-body">
                                    <div class="form-row">
                                        <div class="form-group col">
                                            <label>{{ __('levels.rg') }}</label> <span class="text-danger">*</span>
                                            <input type="text" name="rg" class="form-control @error('rg') is-invalid @enderror" value="{{ old('rg') }}">
                                            @error('rg')
                                            <div class="invalid-feedback">
                                                {{ $message }}
                                            </div>
                                            @enderror
                                        </div>
                                        <div class="form-group col">
                                            <label>{{ __('levels.cpf') }}</label> <span class="text-danger">*</span>
                                            <input type="number" name="cpf" pattern="+[7-9]{2}-[0-9]{3}-[0-9]{4}" class="form-control @error('cpf') is-invalid @enderror" value="{{ old('cpf') }}">
                                            @error('cpf')
                                            <div class="invalid-feedback">
                                                {{ $message }}
                                            </div>
                                            @enderror
                                        </div>
                                    </div>

                                    <div class="form-row">
                                        <div class="form-group col">
                                            <label>{{ __('levels.first_name') }}</label> <span class="text-danger">*</span>
                                            <input type="text" name="first_name" class="form-control @error('first_name') is-invalid @enderror" value="{{ old('first_name') }}">
                                            @error('first_name')
                                            <div class="invalid-feedback">
                                                {{ $message }}
                                            </div>
                                            @enderror
                                        </div>
                                        <div class="form-group col">
                                            <label>{{ __('levels.last_name') }}</label> <span class="text-danger">*</span>
                                            <input type="text" name="last_name" class="form-control @error('last_name') is-invalid @enderror" value="{{ old('last_name') }}">
                                            @error('last_name')
                                            <div class="invalid-feedback">
                                                {{ $message }}
                                            </div>
                                            @enderror
                                        </div>
                                    </div>
    
                                    <div class="form-row">
                                        <div class="form-group col">
                                            <label>{{ __('levels.phone') }}</label> <span class="text-danger">*</span>
                                            <input type="text" name="phone" pattern="+[7-9]{2}-[0-9]{3}-[0-9]{4}" class="form-control @error('phone') is-invalid @enderror" value="{{ old('phone') }}">
                                            @error('phone')
                                            <div class="invalid-feedback">
                                                {{ $message }}
                                            </div>
                                            @enderror
                                        </div>
                                        <div class="form-group col">
                                            <label for="status">{{ __('levels.status') }}</label> <span class="text-danger">*</span>
                                            <select name="status" class="form-control @error('status') is-invalid @enderror">
                                                @foreach(trans('user_statuses') as $key => $status)
                                                    <option value="{{ $key }}" {{ (old('status') == $key) ? 'selected' : '' }}>{{ $status }}</option>
                                                @endforeach
                                            </select>
                                            @error('status')
                                            <div class="invalid-feedback">
                                                {{ $message }}
                                            </div>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-group col">
                                            <label>{{ __('levels.address') }}</label> <span class="text-danger">*</span>
                                            <textarea style="height:150px" rows="4" name="address" class="form-control @error('address') is-invalid @enderror" value="{{ old('address') }}"></textarea>
                                            @error('address')
                                            <div class="invalid-feedback">
                                                {{ $message }}
                                            </div>
                                            @enderror
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer">
                                    <button class="btn btn-primary mr-1" type="submit">{{ __('levels.submit') }}</button>
                                </div>
                            </div>
                        </form>
					</div>
				</div>
			</div>
        </div>
    </section>

@endsection

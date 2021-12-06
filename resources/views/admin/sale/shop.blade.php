@extends('admin.layouts.master')

@section('main-content')

	<section class="section">
        <div class="section-header">
            <h1>{{ __('Please Select Shop') }}</h1>
        </div>

        <div class="section-body">
        	<div class="row">
	   			<div class="col-12 col-md-6 col-lg-6">
				    <div class="card">
				    	<form action="{{ route('admin.select-shop.shop') }}" method="POST">
				    		@csrf
						    <div class="card-body">
                                <div class="form-group">
                                    @if(auth()->user()->myrole == 1)
                                        <div class="form-group">
                                            <label for="shop_id">{{ __('Shop') }}</label> <span class="text-danger">*</span>
                                            <select name="shop_id" id="shop_id"
                                                    class="select2 form-control @error('shop_id') is-invalid red-border @enderror">
                                                <option value="">{{ __('Select Shop') }}</option>
                                                @if(!blank($shops))
                                                    @foreach($shops as $shop)
                                                        <option value="{{ $shop->id }}"
                                                            {{ (old('shop_id') == $shop->id) ? 'selected' : '' }}>{{ $shop->name }}
                                                        </option>
                                                    @endforeach
                                                @endif
                                            </select>
                                            @error('shop_id')
                                            <div class="invalid-feedback">
                                                {{ $message }}
                                            </div>
                                            @enderror
                                        </div>
                                    @endif
                                </div>

						    </div>
					        <div class="card-footer">
		                    	<button class="btn btn-primary mr-1" type="submit">{{ __('Submit') }}</button>
		                  	</div>
		                </form>
					</div>
				</div>
			</div>
        </div>
    </section>

@endsection

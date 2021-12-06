@extends('admin.layouts.master')

@section('css')
    <link rel="stylesheet" href="{{ asset('assets/modules/select2/dist/css/select2.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/modules/bootstrap-social/bootstrap-social.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/modules/summernote/summernote-bs4.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/modules/bootstrap-datepicker/css/bootstrap-datepicker.min.css') }}">

@endsection

@section('main-content')

	<section class="section">
        <div class="section-header">
            <h1>{{ __('Add Purchase') }}</h1>
            {{ Breadcrumbs::render('purchase/add') }}
        </div>

        <div class="section-body">
        	<div class="row">
                <div class="col-12 col-md-12 col-lg-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="form-row">
                                @if(auth()->user()->myrole == 1)
                                    <div class="form-group col-md-4">
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
                                @else
                                    <input type="hidden" name="shop_id" id="shop_id" value="{{auth()->user()->shop->id ?? 0}}">
                                @endif
                                <div class="form-group col-md-4 input-daterange" id="date-picker">
                                    <label for="product">{{ __('Date') }}</label>
                                    <input autocomplete="off" class="form-control" id="date" type="text" name="date" value="{{ \Carbon\Carbon::now()->format('d-m-Y') }}">
                                </div>
                                <div class="form-group col-md-4">
                                    <label for="purchases_no">{{ __('Reference No') }}</label>
                                    <input  class="form-control" id="purchases_no" type="text" name="purchases_no" value="{{old('purchases_no')}}">
                                </div>
                                <div class="form-group col-md-12">
                                    <label for="product">{{ __('Product') }}</label>
                                    <select id="product" name="product" class="form-control select2">
                                        <option value="0">{{ __('Select Product') }}</option>
                                        @if(!blank($products))
                                            @foreach($products as $product)
                                                @if($product->type == 10 && !blank($product->variations))
                                                    <option value="{{ $product->id }}" data-product-type="{{$product->type}}" data-variant="{{$product->variations[0]->id}}">{{$product->barcode}}{{$product->variations[0]->id}}-{{ $product->name }} ({{$product->variations[0]->name}})</option>
                                                    @else
                                                    <option value="{{ $product->id }}" data-variant="" data-product-type="{{$product->type}}">{{$product->barcode}}-{{ $product->name }}</option>
                                                @endif
                                            @endforeach
                                        @endif
                                    </select>
                                </div>
                            </div>

                            <div class="table-responsive">
                                    <table class="table table-bordered product-style purchase-table-font">
                                    <thead>
                                    <tr>
                                        <th class="row-cols-sm-1">{{__('#')}}</th>
                                        <th class="row-cols-sm-3">{{__('Product')}}</th>
                                        <th class="row-cols-sm-1" >{{__('Unit Price')}}</th>
                                        <th class="row-cols-sm-1">{{__('Quantity')}}</th>
                                        <th class="row-cols-sm-2">{{__('Subtotal')}}</th>
                                        <th class="row-cols-sm-1">{{__('Action')}}</th>
                                    </tr>
                                    </thead>
                                    <tbody id="productList">
                                    </tbody>

                                    <tfoot id="productListFooter">
                                    <tr class="purchase-table-td">
                                        <td colspan="3"><span class="pull-right"><b><?='Total'?></b></span></td>
                                        <td id="totalQuantity">0.00</td>
                                        <td id="totalSubtotal">0.00</td>
                                        <td></td>
                                    </tr>
                                    </tfoot>
                                </table>
                            </div>
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="site_description">{{ __('Note') }}</label>
                                    <textarea name="description" id="description" cols="30" rows="3" class="form-control small-textarea-height @error('description') is-invalid @enderror">{{ old('description') }}</textarea>
                                    @error('description')
                                    <div class="invalid-feedback">
                                        <strong>{{ $message }}</strong>
                                    </div>
                                    @enderror
                                </div>
                            </div>
                        </div>
                        <div class="card-footer">
                            <button id="addPurchaseButton" class="btn btn-primary mr-1" type="submit">{{ __('Submit') }}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!----modal starts here--->
    <div id="productVariantModal" class="modal fade" role='dialog'>
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="productTitle"></h4>
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                </div>
                <div class="modal-body" id= "modal-body">
                    <div class="modal-body">
                        <div class="form-group col-10">
                            <label for="ProductVariants">{{ __('Product Variants') }}</label>
                            <select id="ProductVariants"  class="form-control">
                            </select>
                        </div>
                        <div class="form-group col-10">
                            <label for="pquantity">{{ __('Quantity') }}</label>
                            <input  class="form-control" id="pquantity" type="number">
                        </div>
                        <div class="form-group col-10">
                            <label for="pprice">{{ __('Price') }}</label>
                            <input  class="form-control" id="pprice" type="number" >
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="addProductVariant" class="btn btn-primary mr-1" type="button">{{ __('Submit') }}</button>
                </div>
            </div>
        </div>
    </div>

@endsection
@section('scripts')
    <script src="{{ asset('assets/modules/select2/dist/js/select2.full.min.js') }}"></script>
    <script src="{{ asset('assets/modules/summernote/summernote-bs4.js') }}"></script>
    <script src="{{ asset('assets/modules/bootstrap-datepicker/js/bootstrap-datepicker.min.js') }}"></script>


    <script>
        "use strict";
        var productobj = @json($productobj);
        var storePurchaseProduct = "{{ route('admin.purchase.store') }}";
        var indexPurchaseUrl = "{{ route('admin.purchase.index') }}";
        var productVariantUrl = "{{ route('admin.product-variants') }}";
        var productShopUrl = "{{ route('admin.shop-product') }}";
    </script>
    <script src="{{ asset('js/purchase/create.js') }}"></script>
@endsection

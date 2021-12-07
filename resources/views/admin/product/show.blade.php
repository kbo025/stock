@extends('admin.layouts.master')

@section('css')
    <link rel="stylesheet" href="{{ asset('assets/modules/bootstrap-social/bootstrap-social.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/modules/summernote/summernote-bs4.css') }}">
@endsection

@section('main-content')
    <section class="section">
        <div class="section-header">
            <h1>{{ __('levels.Products') }}</h1>
            {{ Breadcrumbs::render('products/view') }}
        </div>
        <div class="section-body">
            <div class="row mt-sm-4">
                <div class="col-12 col-md-12 col-lg-7">
                    <div class="card profile-widget">
                        <div class="profile-widget-header">
                            <img alt="image" src="{{ $product->images }}" class="rounded-circle profile-picture">
                        </div>
                        <div class="profile-widget-description">
                            <dl class="row">
                                <dt class="col-sm-4">{{ __('levels.name') }}</dt>
                                <dd class="col-sm-8">{{ $product->name }}</dd>
                            </dl>
                            <dl class="row">
                                <dt class="col-sm-4">{{ __('levels.Category') }}</dt>
                                <dd class="col-sm-8">{{ implode(', ', $product->categories()->pluck('name')->toArray()) }}</dd>
                            </dl>
                            <dl class="row">
                                <dt class="col-sm-4">{{ __('levels.Unit') }}</dt>
                                <dd class="col-sm-8">{{ $product->unit->name }}</dd>
                            </dl>
                            <dl class="row">
                                <dt class="col-sm-4">{{ __('levels.Cost') }}</dt>
                                <dd class="col-sm-8">{{ currencyFormat($product->cost) }}</dd>
                            </dl>
                            <dl class="row">
                                <dt class="col-sm-4">{{ __('levels.price') }}</dt>
                                <dd class="col-sm-8">{{ currencyFormat($product->price) }}</dd>
                            </dl>

                            <dl class="row">
                                <dt class="col-sm-4">{{ __('levels.Tax Rate') }}</dt>
                                <dd class="col-sm-8">{{ optional($product->tax)->name }}</dd>
                            </dl>
                            <dl class="row">
                                <dt class="col-sm-4">{{ __('levels.shop') }}</dt>
                                <dd class="col-sm-8">{{ $product->shop->name }}</dd>
                            </dl>
                            <dl class="row">
                                <dt class="col-sm-4">{{ __('levels.status') }}</dt>
                                <dd class="col-sm-8">{{ trans('statuses.'.$product->status) }}</dd>
                            </dl>
                            <dl class="row">
                                <dt class="col-sm-4">{{ __('levels.Barcode') }}</dt>
                                <dd class="col-sm-8"> <img src="{{$product->barcodeprint}}" alt="{{$product->barcode}}"  /></dd>
                            </dl>
                            <dl class="row">
                                <dt class="col-sm-4">{{ __('levels.Qrcode') }}</dt>
                                <dd class="col-sm-4"><img src="{{$product->qrcodeprint}}" alt="{{$product->barcode}}"   /></dd>
                            </dl>

                            <dl class="row">
                                <dt class="col-sm-4">{{ __('levels.description') }}</dt>
                                <dd class="col-sm-8">{{ strip_tags($product->description) }}</dd>
                            </dl>
                            <dl class="row">
                                <dt class="col-sm-4">{{ __('levels.Create Date') }}</dt>
                                <dd class="col-sm-8">{{ $product->created_at->diffForHumans() }}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
                @if(!blank($product->variations))
                <div class="col-12 col-md-12 col-lg-5">
                    <div class="card profile-widget">
                        <div class="profile-widget-header">
                            <h2 class="section-title">{{ __('levels.Product Variations') }}</h2>
                        </div>
                        <div class="profile-widget-description">
                            <div class="table-responsive">
                                <table class="table table-striped" id="itemTable">
                                    <thead>
                                    <tr>
                                        <th>{{ __('levels.name') }}</th>
                                        <th>{{ __('levels.Additional Price') }}</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    @foreach($product->variations as $variation)
                                            <tr>
                                                <td>{{ $variation->name }}</td>
                                                <td>{{ currencyFormat($variation->price) }}</td>
                                            </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
             @endif
            </div>
        </div>
    </section>
@endsection

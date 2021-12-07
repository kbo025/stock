@extends('admin.layouts.master')

@section('main-content')

  <section class="section">
        <div class="section-header">
            <h1>{{ __('levels.Stocks') }}</h1>
            {{ Breadcrumbs::render('stocks') }}
        </div>

        <div class="section-body">
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-striped" id="maintable" data-url="{{ route('admin.stock.get-stock') }}" data-status="{{ \App\Enums\Status::ACTIVE }}">
                                    <thead>
                                        <tr>
                                            <th>{{ __('levels.ID') }}</th>
                                            <th>{{ __('levels.product') }}</th>
                                            <th>{{ __('levels.Unit') }}</th>
                                            <th>{{ __('levels.Sale Qty') }}</th>
                                            <th>{{ __('levels.Total Qty') }}</th>
                                            <th>{{ __('levels.Stock Qty') }}</th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
@endsection

@section('css')
    <link rel="stylesheet" href="{{ asset('assets/modules/datatables.net-bs4/css/dataTables.bootstrap4.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/modules/datatables.net-select-bs4/css/select.bootstrap4.min.css') }}">
@endsection

@section('scripts')
    <script src="{{ asset('assets/modules/datatables/media/js/jquery.dataTables.min.js') }}"></script>
    <script src="{{ asset('assets/modules/datatables.net-bs4/js/dataTables.bootstrap4.min.js') }}"></script>
    <script src="{{ asset('assets/modules/datatables.net-select-bs4/js/select.bootstrap4.min.js') }}"></script>
    <script src="{{ asset('js/stock/index.js') }}"></script>
@endsection

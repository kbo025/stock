@extends('admin.layouts.master')

@section('main-content')

    <section class="section">
        <div class="section-header">
            <h1>{{ __('Tax Rates') }}</h1>
            {{ Breadcrumbs::render('taxs') }}
        </div>

        <div class="section-body">
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        @if(auth()->user()->can('tax_create'))
                        <div class="card-header">
                            <a href="{{ route('admin.tax.create') }}" class="btn btn-icon icon-left btn-primary"><i class="fas fa-plus"></i> {{ __('Add Tax') }}
                            </a>
                        </div>
                        @endif
                        <div class="card-body">
                            <div class="row">
                                <div class="col-sm-6 offset-sm-3">
                                    <div class="input-group input-daterange" id="date-picker">
                                        <select class="form-control" id="status" name="status" id="">
                                            @foreach(trans('statuses') as $key => $status)
                                                <option value="{{ $key }}">{{ $status }}</option>
                                            @endforeach
                                        </select>
                                        <div class="input-group-append">
                                            <button class="btn btn-outline-secondary" type="button" id="refresh"> {{ __('Refresh') }}</button>
                                        </div>
                                        <div class="input-group-append">
                                            <button class="btn btn-outline-secondary" type="button" id="date-search">{{ __('Search') }}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br>
                            <div class="table-responsive">
                                <table class="table table-striped" id="maintable" data-url="{{ route('admin.tax.get-tax') }}" data-status="{{ \App\Enums\Status::ACTIVE }}">
                                    <thead>
                                    <tr>
                                        <th>{{ __('ID') }}</th>
                                        <th>{{ __('Name') }}</th>
                                        <th>{{ __('Code') }}</th>
                                        <th>{{ __('Tax Rate') }}</th>
                                        <th>{{ __('Type') }}</th>
                                        <th>{{ __('Status') }}</th>
                                        <th>{{ __('Actions') }}</th>
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
    <script src="{{ asset('js/tax/index.js') }}"></script>

@endsection

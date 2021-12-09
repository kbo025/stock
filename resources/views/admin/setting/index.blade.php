@extends('admin.layouts.master')

@section('main-content')

    <section class="section">
        <div class="section-header">
            <h1>{{ __('levels.settings') }}</h1>

            @yield('admin.setting.breadcrumbs')
        </div>
    </section>

    <div class="row">
        <div class="col-md-3">
            <div class="bg-light card">
                <div class="list-group list-group-flush">
                    <a href="{{ route('admin.setting.index') }}" class="border-0 list-group-item list-group-item-action {{ (request()->is('admin/setting')) ? 'active' : '' }} ">{{ __('levels.site_setting') }}</a>
                    <a href="{{ route('admin.setting.whatsapp') }}" class="border-0 list-group-item list-group-item-action {{ (request()->is('admin/setting/whatsapp')) ? 'active' : '' }}">{{ __('levels.whatsapp_sms_setting') }}</a>
                    <a href="{{ route('admin.setting.sms') }}" class="border-0 list-group-item list-group-item-action {{ (request()->is('admin/setting/sms')) ? 'active' : '' }}">{{ __('levels.sms_setting') }}</a>
                    <a href="{{ route('admin.setting.payment') }}" class="border-0 list-group-item list-group-item-action {{ (request()->is('admin/setting/payment')) ? 'active' : '' }}">{{ __('levels.payment_setting') }}</a>
                    <a href="{{ route('admin.setting.email') }}" class="border-0 list-group-item list-group-item-action {{ (request()->is('admin/setting/email')) ? 'active' : '' }}">{{ __('levels.email_setting') }}</a>
                </div>
            </div>
        </div>

        @yield('admin.setting.layout')
    </div>

@endsection

@section('css')
    <link rel="stylesheet" href="{{ asset('assets/modules/summernote/summernote-bs4.css') }}">
@endsection

@section('scripts')
    <script src="{{ asset('assets/modules/summernote/summernote-bs4.js') }}"></script>
    <script src="{{ asset('js/setting/create.js') }}"></script>
@endsection

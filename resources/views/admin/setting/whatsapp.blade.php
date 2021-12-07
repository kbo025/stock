@extends('admin.setting.index')

@section('admin.setting.breadcrumbs')
    {{ Breadcrumbs::render('whatsapp-setting') }}
@endsection

@section('admin.setting.layout')
     <div class="col-md-9">
        <div class="card">
            <div class="card-body">
                <form class="form-horizontal" role="form" method="POST" action="{{ route('admin.setting.whatsapp-update') }}">
                    @csrf
                    <fieldset class="setting-fieldset">
                        <legend class="setting-legend">{{ __('levels.WhatsApp SMS Setting') }}</legend>
                        <div class="row">
                            <div class="col-sm-10">
                                <div class="form-group">
                                    <label for="wati_auth_token">{{ __('levels.WATI Auth Token') }}</label> <span
                                        class="text-danger">* {{__('levels.(Your WATI WhatsApp Auth Token )')}}</span>
                                    <input name="wati_auth_token" id="wati_auth_token" type="text"
                                        class="form-control {{ $errors->has('wati_auth_token') ? ' is-invalid ' : '' }}"
                                        value="{{ old('wati_auth_token', setting('wati_auth_token')) }}">
                                    @if ($errors->has('wati_auth_token'))
                                    <div class="invalid-feedback">
                                        {{ $errors->first('wati_auth_token') }}
                                    </div>
                                    @endif
                                </div>
                                <div class="form-group">
                                    <label for="wati_api_endpoint">{{ __('levels.WATI API Endpoint') }}</label> <span
                                        class="text-danger">* {{__('levels.(Your WATI WhatsApp Endpoint )')}}</span>
                                    <input name="wati_api_endpoint" id="wati_api_endpoint" type="text"
                                        class="form-control {{ $errors->has('wati_api_endpoint') ? ' is-invalid ' : '' }}"
                                        value="{{ old('wati_api_endpoint', setting('wati_api_endpoint')) }}">
                                    @if ($errors->has('wati_api_endpoint'))
                                    <div class="invalid-feedback">
                                        {{ $errors->first('wati_api_endpoint') }}
                                    </div>
                                    @endif
                                </div>
                                <div class="form-group">
                                    <label for="wati_template_name">{{ __('levels.WATI Template Name') }}</label> <span
                                        class="text-danger">* {{__('levels.(Your WATI WhatsApp Template Name )')}}</span>
                                    <input name="wati_template_name" id="wati_template_name" type="text"
                                        class="form-control {{ $errors->has('wati_template_name') ? ' is-invalid ' : '' }}"
                                        value="{{ old('wati_template_name', setting('wati_template_name')) }}">
                                    @if ($errors->has('wati_template_name'))
                                    <div class="invalid-feedback">
                                        {{ $errors->first('wati_template_name') }}
                                    </div>
                                    @endif
                                </div>
                                <div class="form-group">
                                    <label>{{ __('levels.status') }}</label> <span class="text-danger">*</span>
                                    <select name="wati_disabled" id="wati_disabled"
                                            class="form-control @error('wati_disabled') is-invalid @enderror">
                                        <option value="1" {{ (old('wati_disabled', setting('wati_disabled')) == 1) ? 'selected' : '' }}> {{ __('levels.Enable') }}</option>
                                        <option value="0" {{ (old('wati_disabled', setting('wati_disabled')) == 0) ? 'selected' : '' }}> {{ __('levels.Disable') }}</option>
                                    </select>
                                    @error('wati_disabled')
                                    <div class="invalid-feedback">
                                        {{ $message }}
                                    </div>
                                    @enderror
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <div class="row">
                        <div class="form-group col-md-6">
                            <button class="btn btn-primary">
                                <span>{{ __('levels.Update WhatsApp Sms Setting') }}</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection


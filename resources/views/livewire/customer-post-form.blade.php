<form action="#">
    <div class="card">
        <div class="card-body">
            <div class="form-row">
                <div class="form-group col-6">
                    <label for="first_name">{{ __('levels.first_name') }}</label> <span class="text-danger">*</span>
                    <input wire:model="customer.first_name" type="text" name="first_name" id="first_name"  class="form-control @error('customer.first_name') is-invalid @enderror">
                    @error('customer.first_name')
                    <div class="invalid-feedback">
                        {{ $message }}
                    </div>
                    @enderror
                </div>
            </div>
            <div class="form-row">
                <div class="form-group col-6">
                    <label for="last_name">{{ __('levels.last_name') }}</label> <span class="text-danger">*</span>
                    <input wire:model="customer.last_name" type="text" name="last_name" id="last_name"  class="form-control @error('customer.last_name') is-invalid @enderror">
                    @error('customer.last_name')
                    <div class="invalid-feedback">
                        {{ $message }}
                    </div>
                    @enderror
                </div>
            </div>
            <div class="form-row">
                <div class="form-group col-6">
                    <label for="phone">{{ __('levels.phone') }}</label> <span class="text-danger">* {{__('levels.( Example of country code phone number : +15129004889 )')}}</span>
                    <input wire:model="customer.phone" type="number" name="phone" id="phone" pattern="+[7-9]{2}-[0-9]{3}-[0-9]{4}" max="15"  class="form-control @error('customer.phone') is-invalid @enderror">
                    @error('customer.phone')
                    <div class="invalid-feedback">
                        {{ $message }}
                    </div>
                    @enderror
                </div>
            </div>
            @if(!$updateMode)
            <div class="form-row">
                <div class="form-group col-6">
                    <label for="deposit_amount">{{ __('levels.Deposit amount') }}</label> <span class="text-danger">*</span>
                    <input wire:model="customer.deposit_amount" type="number" name="deposit_amount" id="deposit_amount"  class="form-control @error('customer.deposit_amount') is-invalid @enderror">
                    @error('customer.deposit_amount')
                    <div class="invalid-feedback">
                        {{ $message }}
                    </div>
                    @enderror
                </div>
            </div>
                @endif
        </div>
        <div class="card-footer">

            @if($updateMode)
                <button wire:click.prevent="update({{$user}})" class="btn btn-primary mr-1">{{ __('levels.update') }}</button>
                @else
                <button wire:click.prevent="store()" class="btn btn-primary mr-1">{{ __('levels.submit') }}</button>
            @endif
        </div>
    </div>
</form>

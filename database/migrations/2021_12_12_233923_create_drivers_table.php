<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDriversTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('drivers', function (Blueprint $table) {
            $table->id();
            $table->string('rg');
            $table->string('cpf');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('phone')->unique();
            $table->longText('address')->nullable();
            //$table->string('email')->nullable()->unique();
            //$table->timestamp('email_verified_at')->nullable();
            // $table->string('username')->nullable();
            // $table->string('password');
            // $table->integer('balance_id');
             $table->unsignedBigInteger('status_id')->default(\App\Enums\DriverStatus::ACTIVE);
            // $table->rememberToken();
            
            $table->unsignedBigInteger('shop_id');
            $table->foreign('shop_id')->references('id')->on('shops')->onDelete('cascade');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('drivers');
    }
}

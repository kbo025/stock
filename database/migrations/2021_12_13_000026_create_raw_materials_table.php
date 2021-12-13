<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRawMaterialsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('raw_materials', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug');
            $table->longText('description')->nullable();
            $table->decimal('quantity', 13, 2);
            // $table->decimal('cost', 13, 2);
            // $table->decimal('price', 13, 2);
            // $table->string('barcode_type')->nullable();
            $table->longText('barcode')->nullable();
            $table->unsignedInteger('type');
            $table->unsignedTinyInteger('status');

            $table->unsignedInteger('unit_id');
            $table->unsignedBigInteger('shop_id');
            
            $table->timestamps();
            $table->auditColumn();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('raw_materials');
    }
}

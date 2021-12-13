<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRawMaterialMovementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('raw_material_movements', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->date('date');
            $table->decimal('quantity');
            $table->string('description', 1000);
            $table->unsignedTinyInteger('type');
            
            $table->unsignedInteger('raw_material_id');

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
        Schema::dropIfExists('raw_material_movements');
    }
}

<?php
namespace Database\Seeders;

use App\Models\BackendMenu;
use Illuminate\Database\Seeder;

class BackendMenuTableSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $parent = [
            'ativos'    => 1,
            'product'   => 2,
            'customer'  => 3,
            'hrm'       => 4,
            'report'    => 5,
        ];

        $menus = [

            [
                'name'      => 'Ativos',
                'link'      => '#',
                'icon'      => 'fas fa-truck',
                'parent_id' => 0,
                'priority'  => 460,
                'status'    => 1,
            ],

            [
                'name'      => 'Produtos',
                'link'      => '#',
                'icon'      => 'fas fa-gift',
                'parent_id' => 0,
                'priority'  => 460,
                'status'    => 1,
            ],

            [
                'name'      => 'Clientes',
                'link'      => '#',
                'icon'      => 'fas fa-address-book',
                'parent_id' => 0,
                'priority'  => 450,
                'status'    => 1,
            ],

            [
                'name'      => 'HRM',
                'link'      => '#',
                'icon'      => 'fas fa-id-card ',
                'parent_id' => 0,
                'priority'  => 450,
                'status'    => 1,
            ],

            [
                'name'      => 'Relatorios',
                'link'      => '#',
                'icon'      => 'fas fa-archive',
                'parent_id' => 0,
                'priority'  => 390,
                'status'    => 1,
            ],

            [
                'name'      => 'Dashboard',
                'link'      => 'dashboard',
                'icon'      => 'fas fa-laptop',
                'parent_id' => 0,
                'priority'  => 500,
                'status'    => 1,
            ],

            [
                'name'      => 'Lojas',
                'link'      => 'shop',
                'icon'      => 'fas fa-university',
                'parent_id' => 0,
                'priority'  => 510,
                'status'    => 1,
            ],

            [
                'name'      => 'Categorias',
                'link'      => 'category',
                'icon'      => 'fas fa-list-ul',
                'parent_id' => 0,
                'priority'  => 400,
                'status'    => 1,
            ],

            [
                'name'      => 'Veiculos',
                'link'      => 'vehicles',
                'icon'      => 'fas fa-truck',
                'parent_id' => $parent['ativos'],
                'priority'  => 460,
                'status'    => 1,
            ],

            [
                'name'      => 'Peças',
                'link'      => 'parts',
                'icon'      => 'fas fa-cogs',
                'parent_id' => $parent['ativos'],
                'priority'  => 460,
                'status'    => 1,
            ],

            [
                'name'      => 'Unidades',
                'link'      => 'unit',
                'icon'      => 'fas fa-star',
                'parent_id' => $parent['product'],
                'priority'  => 480,
                'status'    => 1,
            ],
            [
                'name'      => 'Produtos',
                'link'      => 'products',
                'icon'      => 'fas fa-gift',
                'parent_id' => $parent['product'],
                'priority'  => 460,
                'status'    => 1,
            ],

            [
                'name'      => 'Barcode/Label',
                'link'      => 'barcode',
                'icon'      => 'fa fa-barcode',
                'parent_id' => $parent['product'],
                'priority'  => 460,
                'status'    => 0,
            ],

            [
                'name'      => 'Compras',
                'link'      => 'purchase',
                'icon'      => 'fas fa-newspaper',
                'parent_id' => 0,
                'priority'  => 460,
                'status'    => 1,
            ],
            [
                'name'      => 'POS',
                'link'      => 'pos',
                'icon'      => 'fas fa-th',
                'parent_id' => 0,
                'priority'  => 460,
                'status'    => 0,
            ],
            [
                'name'      => 'Vendas',
                'link'      => 'sale',
                'icon'      => 'fas fa-newspaper',
                'parent_id' => 0,
                'priority'  => 440,
                'status'    => 0,
            ],
            [
                'name'      => 'Stock',
                'link'      => 'stock',
                'icon'      => 'fas fa-braille',
                'parent_id' => 0,
                'priority'  => 460,
                'status'    => 1,
            ],

            [
                'name'      => 'Clientes',
                'link'      => 'customers',
                'icon'      => 'fas fa-user-secret',
                'parent_id' => $parent['customer'],
                'priority'  => 490,
                'status'    => 1,
            ],

            [
                'name'      => 'Depósitos dos clientes',
                'link'      => 'deposit',
                'icon'      => 'fas fa-dollar-sign',
                'parent_id' => $parent['customer'],
                'priority'  => 490,
                'status'    => 1,
            ],

            [
                'name'      => 'Administradores',
                'link'      => 'administrators',
                'icon'      => 'fas fa-users',
                'parent_id' => $parent['hrm'],
                'priority'  => 500,
                'status'    => 1,
            ],

            [
                'name'      => 'Motoristas',
                'link'      => 'drivers',
                'icon'      => 'fas fa-user',
                'parent_id' => $parent['hrm'],
                'priority'  => 495,
                'status'    => 1,
            ],

            [
                'name'      => 'Taxas de impostos',
                'link'      => 'tax',
                'icon'      => 'fas fa-percent',
                'parent_id' => $parent['hrm'],
                'priority'  => 490,
                'status'    => 1,
            ],


            [
                'name'      => 'Role',
                'link'      => 'role',
                'icon'      => 'fas fa-star',
                'parent_id' => $parent['hrm'],
                'priority'  => 470,
                'status'    => 1,
            ],

            [
                'name'      => 'Relatorio de Vendas',
                'link'      => 'sales-report',
                'icon'      => 'fas fa-list-alt',
                'parent_id' => $parent['report'],
                'priority'  => 380,
                'status'    => 1,
            ],
            [
                'name'      => 'Relatorio de Compras',
                'link'      => 'purchases-report',
                'icon'      => 'fas fa-list-alt',
                'parent_id' => $parent['report'],
                'priority'  => 375,
                'status'    => 1,
            ],
            [
                'name'      => 'Stock',
                'link'      => 'stock-report',
                'icon'      => 'fas fa-list-alt',
                'parent_id' => $parent['report'],
                'priority'  => 370,
                'status'    => 1,
            ],


            [
                'name'      => 'Configurações',
                'link'      => 'setting',
                'icon'      => 'fas fa-cogs',
                'parent_id' => 0,
                'priority'  => 360,
                'status'    => 1,
            ],
        ];

        BackendMenu::insert($menus);
    }
}

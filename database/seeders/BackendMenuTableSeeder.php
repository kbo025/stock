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
            'product' 	=> 4,
            'customer' 	=> 12,
            'hrm' 		=> 15,
            'report'    => 19,
        ];

        $menus = [
            [
                'name'      => 'Dashboard',
                'link'      => 'dashboard',
                'icon'      => 'fas fa-laptop',
                'parent_id' => 0,
                'priority'  => 500,
                'status'    => 1,
            ],

            [
                'name'      => 'Shops',
                'link'      => 'shop',
                'icon'      => 'fas fa-university',
                'parent_id' => 0,
                'priority'  => 510,
                'status'    => 1,
            ],

            [
                'name'      => 'Categories',
                'link'      => 'category',
                'icon'      => 'fas fa-list-ul',
                'parent_id' => 0,
                'priority'  => 400,
                'status'    => 1,
            ],

            [
                'name'      => 'Products',
                'link'      => '#',
                'icon'      => 'fas fa-gift',
                'parent_id' => 0,
                'priority'  => 460,
                'status'    => 1,
            ],
            [
                'name'      => 'Units',
                'link'      => 'unit',
                'icon'      => 'fas fa-star',
                'parent_id' => $parent['product'],
                'priority'  => 480,
                'status'    => 1,
            ],
            [
                'name'      => 'Products',
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
                'status'    => 1,
            ],


            [
                'name'      => 'Purchase',
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
                'status'    => 1,
            ],
            [
                'name'      => 'Sales',
                'link'      => 'sale',
                'icon'      => 'fas fa-newspaper',
                'parent_id' => 0,
                'priority'  => 440,
                'status'    => 1,
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
                'name'      => 'Customers',
                'link'      => '#',
                'icon'      => 'fas fa-address-book',
                'parent_id' => 0,
                'priority'  => 450,
                'status'    => 1,
            ],

            [
                'name'      => 'Customers',
                'link'      => 'customers',
                'icon'      => 'fas fa-user-secret',
                'parent_id' => $parent['customer'],
                'priority'  => 490,
                'status'    => 1,
            ],

            [
                'name'      => 'Deposit',
                'link'      => 'deposit',
                'icon'      => 'fas fa-dollar-sign',
                'parent_id' => $parent['customer'],
                'priority'  => 490,
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
                'name'      => 'Administrators',
                'link'      => 'administrators',
                'icon'      => 'fas fa-users',
                'parent_id' => $parent['hrm'],
                'priority'  => 500,
                'status'    => 1,
            ],

            [
                'name'      => 'Tax Rates',
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
                'name'      => 'Report',
                'link'      => '#',
                'icon'      => 'fas fa-archive',
                'parent_id' => 0,
                'priority'  => 390,
                'status'    => 1,
            ],
            [
                'name'      => 'Sales Report',
                'link'      => 'sales-report',
                'icon'      => 'fas fa-list-alt',
                'parent_id' => $parent['report'],
                'priority'  => 380,
                'status'    => 1,
            ],
            [
                'name'      => 'Purchases Report',
                'link'      => 'purchases-report',
                'icon'      => 'fas fa-list-alt',
                'parent_id' => $parent['report'],
                'priority'  => 375,
                'status'    => 1,
            ],
            [
                'name'      => 'Stock Report',
                'link'      => 'stock-report',
                'icon'      => 'fas fa-list-alt',
                'parent_id' => $parent['report'],
                'priority'  => 370,
                'status'    => 1,
            ],


            [
                'name'      => 'Settings',
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

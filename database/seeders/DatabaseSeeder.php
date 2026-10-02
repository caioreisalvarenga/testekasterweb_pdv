<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'testePDV',
            'email' => 'teste@pdv.com',
            'password' => Hash::make('senha123'),
        ]);
    }
}
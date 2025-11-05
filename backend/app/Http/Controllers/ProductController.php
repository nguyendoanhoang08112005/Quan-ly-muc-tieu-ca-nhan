<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        // Dữ liệu mẫu, tí nữa có DB thì sửa
        $products = [
            ['id' => 1, 'ten_san_pham' => 'Giày Nike Air Force 1'],
            ['id' => 2, 'ten_san_pham' => 'Giày Adidas Ultraboost'],
            ['id' => 3, 'ten_san_pham' => 'Giày Converse Classic'],
        ];

        return response()->json($products);
    }
}

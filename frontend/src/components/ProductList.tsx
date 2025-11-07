import { useEffect, useState } from "react";
import { getProducts } from "../api/productApi";

interface Product {
  id: number;
  ten_san_pham: string;
  gia_khuyen_mai: number;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(setProducts).catch(console.error);
  }, []);

  return (
    <div className="p-4 grid grid-cols-3 gap-4">
      {products.map((p) => (
        <div key={p.id} className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold">{p.ten_san_pham}</h2>
          <p className="text-gray-600">{p.gia_khuyen_mai} đ</p>
        </div>
      ))}
    </div>
  );
}

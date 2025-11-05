import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/products")
      .then(res => {
        console.log("Dữ liệu API:", res.data);
        setProducts(res.data);
      })
      .catch(err => {
        console.error("Lỗi gọi API:", err);
        setError(err.message);
      });
  }, []);

  return (
    <div>
      <h1>Danh sách sản phẩm</h1>
      <h2>Chi tiết sản phẩm</h2>
      <p>Thông tin chi tiết sản phẩm</p>
      {error && <p style={{ color: "red" }}>Lỗi: {error}</p>}
      <ul>
        {products.map(p => (
          <li key={p.id}>{p.ten_san_pham}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

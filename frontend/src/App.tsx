import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Dashboard from "./routes/Dashboard";
import Goals from "./routes/Goals";
import ProductList from "./components/ProductList";


function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center p-4">Danh sách sản phẩm</h1>
      <ProductList />
    </div>
  );
}
// function App() {
//   return (
//     <BrowserRouter>
//       <div className="app">
//         <header>
//           <h1>Hệ thống Quản lý Mục tiêu Cá nhân</h1>
//           <Navigation />
//         </header>
//         <main>
//           <Routes>
//             <Route path="/" element={<Dashboard />} />
//             <Route path="/goals" element={<Goals />} />
//           </Routes>
//         </main>
//       </div>
//     </BrowserRouter>
//   );
// }

// export default function App() {
//   return (
//     <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
//       <div className="bg-white p-10 rounded-2xl shadow-2xl text-center">
//         <h1 className="text-4xl font-bold text-gray-800 mb-4">🎉 TailwindCSS is Working!</h1>
//         <p className="text-gray-600 mb-6">You can now use Tailwind to style your React + TypeScript app.</p>
//         <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
//           Click Me 🚀
//         </button>
//       </div>
//     </div>
//   );
// }


export default App;

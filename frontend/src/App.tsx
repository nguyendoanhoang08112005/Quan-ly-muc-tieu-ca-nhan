import { BrowserRouter, Routes, Route } from "react-router-dom";
import TaskBoard from "./components/TaskBoard";
import Sidebar from "./components/Sidebar";
import Home from "./routes/Home";
import Dashboard from "./routes/Dashboard";
import Goals from "./routes/Goals";
import Profile from "./routes/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang chủ - Landing page */}
        <Route path="/" element={<Home />} />
        
        {/* Dashboard với Sidebar */}
        <Route path="/dashboard" element={
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 overflow-auto">
              <Dashboard />
            </div>
          </div>
        } />

        {/* Goals page với Sidebar */}
        <Route path="/goals" element={
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 overflow-auto">
              <Goals />
            </div>
          </div>
        } />

        {/* Task Board với Sidebar */}
        <Route path="/tasks" element={
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 overflow-auto">
              <TaskBoard />
            </div>
          </div>
        } />

        {/* Profile page với Sidebar */}
        <Route path="/profile" element={
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 overflow-auto">
              <Profile />
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
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

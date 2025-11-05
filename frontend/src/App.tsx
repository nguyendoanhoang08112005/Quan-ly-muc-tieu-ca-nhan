import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Dashboard from "./routes/Dashboard";
import Goals from "./routes/Goals";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header>
          <h1>Hệ thống Quản lý Mục tiêu Cá nhân</h1>
          <Navigation />
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/goals" element={<Goals />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

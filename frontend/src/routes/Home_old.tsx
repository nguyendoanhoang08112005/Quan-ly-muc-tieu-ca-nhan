import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800">
      {/* Navigation Bar */}
      <nav className="absolute top-0 left-0 right-0 z-10 backdrop-blur-sm bg-white/5">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => navigate('/')}>
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-bold text-2xl text-purple-600 shadow-lg group-hover:scale-110 transition-transform">
                M
              </div>
              <span className="text-white font-bold text-2xl group-hover:text-purple-200 transition-colors">My Goals</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 text-white font-medium hover:bg-white/10 rounded-lg transition-all flex items-center gap-2 border border-white/20 hover:border-white/40 hover:scale-105"
              >
                <span className="text-lg">🚀</span>
                <span>Xem Demo</span>
              </button>
              <button
                onClick={() => setShowLogin(true)}
                className="px-6 py-2.5 text-white font-medium hover:bg-white/10 rounded-lg transition-all hover:scale-105"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className="px-6 py-2.5 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Đăng ký ngay
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-screen px-6 pt-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-8 animate-fade-in">
            <span className="inline-block px-5 py-2.5 bg-white/15 text-white rounded-full text-sm font-semibold backdrop-blur-md mb-8 border border-white/30 hover:bg-white/20 transition-all cursor-default">
              🎯 Quản lý mục tiêu thông minh
            </span>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-8 leading-tight">
              Biến Ước Mơ
              <br />
              <span className="bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
                Thành Hiện Thực
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/95 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              Công cụ quản lý mục tiêu cá nhân giúp bạn lập kế hoạch, theo dõi tiến độ 
              <br className="hidden md:block" />
              và đạt được những gì bạn mong muốn một cách dễ dàng.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-20">
            <button
              onClick={() => setShowRegister(true)}
              className="group px-10 py-4 bg-white text-purple-600 font-bold text-lg rounded-xl hover:bg-purple-50 transition-all shadow-2xl hover:shadow-purple-500/50 hover:scale-105 w-full sm:w-auto relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Bắt đầu miễn phí
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="group px-10 py-4 bg-white/15 text-white font-bold text-lg rounded-xl hover:bg-white/25 transition-all backdrop-blur-md border-2 border-white/30 hover:border-white/50 hover:scale-105 w-full sm:w-auto"
            >
              <span className="flex items-center justify-center gap-2">
                <span>👀</span>
                Xem Demo
              </span>
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
            <div className="group bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/15 hover:border-white/40 transition-all cursor-pointer hover:scale-105 hover:shadow-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-5 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-200 transition-colors">Quản lý Task</h3>
              <p className="text-white/80 leading-relaxed">Tạo và theo dõi các nhiệm vụ hàng ngày một cách dễ dàng với giao diện trực quan</p>
            </div>

            <div className="group bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/15 hover:border-white/40 transition-all cursor-pointer hover:scale-105 hover:shadow-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-5 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors">Theo dõi Tiến độ</h3>
              <p className="text-white/80 leading-relaxed">Xem biểu đồ trực quan về tiến trình đạt mục tiêu theo thời gian thực</p>
            </div>

            <div className="group bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/15 hover:border-white/40 transition-all cursor-pointer hover:scale-105 hover:shadow-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center mb-5 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-pink-200 transition-colors">Nhắc nhở Thông minh</h3>
              <p className="text-white/80 leading-relaxed">Không bỏ lỡ bất kỳ deadline nào với hệ thống nhắc nhở tự động</p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative transform transition-all animate-slide-up">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Chào mừng trở lại!</h2>
              <p className="text-gray-600">Đăng nhập để tiếp tục</p>
            </div>

            <form className="space-y-5" onSubmit={(e) => {
              e.preventDefault();
              // TODO: Xử lý logic đăng nhập thực tế
              navigate('/dashboard');
            }}>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all hover:border-gray-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all hover:border-gray-300"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                  <span className="ml-2 text-sm text-gray-600">Ghi nhớ đăng nhập</span>
                </label>
                <a href="#" className="text-sm text-purple-600 hover:text-purple-700 font-semibold">
                  Quên mật khẩu?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Đăng nhập ngay
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Chưa có tài khoản?{' '}
                <button
                  onClick={() => {
                    setShowLogin(false);
                    setShowRegister(true);
                  }}
                  className="text-purple-600 font-bold hover:text-purple-700 hover:underline"
                >
                  Đăng ký ngay
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegister && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative transform transition-all animate-slide-up max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowRegister(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-all z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Tạo tài khoản mới</h2>
              <p className="text-gray-600">Hoàn toàn miễn phí, mãi mãi!</p>
            </div>

            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              // TODO: Xử lý logic đăng ký thực tế
              navigate('/dashboard');
            }}>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên</label>
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all hover:border-gray-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all hover:border-gray-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all hover:border-gray-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all hover:border-gray-300"
                  required
                />
              </div>

              <div className="flex items-start pt-2">
                <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mt-1" required />
                <span className="ml-2.5 text-sm text-gray-600 leading-relaxed">
                  Tôi đồng ý với{' '}
                  <a href="#" className="text-purple-600 hover:text-purple-700 font-semibold hover:underline">
                    Điều khoản dịch vụ
                  </a>{' '}
                  và{' '}
                  <a href="#" className="text-purple-600 hover:text-purple-700 font-semibold hover:underline">
                    Chính sách bảo mật
                  </a>
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 mt-6"
              >
                Tạo tài khoản
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Đã có tài khoản?{' '}
                <button
                  onClick={() => {
                    setShowRegister(false);
                    setShowLogin(true);
                  }}
                  className="text-purple-600 font-bold hover:text-purple-700 hover:underline"
                >
                  Đăng nhập
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

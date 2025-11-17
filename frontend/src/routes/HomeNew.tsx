import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomeNew = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - Adidas Style */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-2xl font-black tracking-tighter text-black">MYGOALS</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <button className="text-sm font-semibold text-black hover:text-gray-600 transition-colors uppercase tracking-wider">
                Tính năng
              </button>
              <button className="text-sm font-semibold text-black hover:text-gray-600 transition-colors uppercase tracking-wider">
                Bảng giá
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="text-sm font-semibold text-black hover:text-gray-600 transition-colors uppercase tracking-wider"
              >
                Demo
              </button>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowLogin(true)}
                className="text-sm font-semibold text-black hover:text-gray-600 transition-colors uppercase tracking-wider"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className="px-6 py-2.5 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-all"
              >
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Full Screen */}
      <section className="relative h-screen flex items-center justify-center bg-white pt-16">
        <div className="absolute inset-0 bg-gray-50"></div>
        
        {/* Background Image Pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,.05) 35px, rgba(0,0,0,.05) 70px)',
        }}></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          {/* Small Label */}
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-600">
              Quản lý mục tiêu
            </span>
          </div>

          {/* Main Headline - Bold & Black */}
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-black text-black mb-8 tracking-tighter leading-none">
            IMPOSSIBLE
            <br />
            IS NOTHING
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-2xl mx-auto font-light">
            Biến ước mơ thành hiện thực với hệ thống quản lý mục tiêu thông minh
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setShowRegister(true)}
              className="px-12 py-4 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-all w-full sm:w-auto"
            >
              Bắt đầu ngay
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-12 py-4 bg-white text-black border-2 border-black text-sm font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-all w-full sm:w-auto"
            >
              Xem demo
            </button>
          </div>

          {/* Small Text */}
          <p className="mt-8 text-xs text-gray-500 uppercase tracking-wider">
            Miễn phí mãi mãi • Không cần thẻ tín dụng
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Stats Section - Minimal */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { number: '10K+', label: 'Người dùng' },
              { number: '50K+', label: 'Mục tiêu đã đạt' },
              { number: '98%', label: 'Hài lòng' },
              { number: '24/7', label: 'Hỗ trợ' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl md:text-6xl font-black mb-2 tracking-tighter">{stat.number}</div>
                <div className="text-sm uppercase tracking-wider text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Clean Grid */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Title */}
          <div className="mb-20">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-600">Tính năng</span>
            <h2 className="text-5xl md:text-6xl font-black text-black mt-4 tracking-tighter">
              MỌI THỨ BẠN CẦN
            </h2>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                title: 'QUẢN LÝ TASK',
                description: 'Tạo và theo dõi các nhiệm vụ hàng ngày một cách dễ dàng với giao diện trực quan',
              },
              {
                title: 'THEO DÕI TIẾN ĐỘ',
                description: 'Xem biểu đồ trực quan về tiến trình đạt mục tiêu theo thời gian thực',
              },
              {
                title: 'NHẮC NHỞ THÔNG MINH',
                description: 'Không bỏ lỡ bất kỳ deadline nào với hệ thống nhắc nhở tự động',
              },
            ].map((feature, index) => (
              <div key={index} className="group">
                <div className="aspect-square bg-gray-100 mb-6 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 group-hover:bg-gray-300 transition-colors">
                    <span className="text-6xl font-black text-gray-400">0{index + 1}</span>
                  </div>
                </div>
                <h3 className="text-xl font-black text-black mb-3 tracking-tight uppercase">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Minimal */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-600">Bảng giá</span>
            <h2 className="text-5xl md:text-6xl font-black text-black mt-4 tracking-tighter">
              CHỌN GÓI PHÙ HỢP
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'FREE',
                price: '0đ',
                period: 'mãi mãi',
                features: ['10 mục tiêu', '50 task/tháng', 'Báo cáo cơ bản', 'Hỗ trợ email'],
                featured: false,
              },
              {
                name: 'PRO',
                price: '99,000đ',
                period: '/tháng',
                features: ['Không giới hạn mục tiêu', 'Không giới hạn task', 'Báo cáo nâng cao', 'Hỗ trợ ưu tiên 24/7', 'Tích hợp Calendar'],
                featured: true,
              },
              {
                name: 'TEAM',
                price: '299,000đ',
                period: '/tháng',
                features: ['Tất cả tính năng Pro', '10 thành viên', 'Workspace riêng', 'Quản lý phân quyền', 'API access'],
                featured: false,
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`p-8 bg-white ${plan.featured ? 'ring-2 ring-black scale-105' : 'border border-gray-200'}`}
              >
                {plan.featured && (
                  <div className="text-xs font-bold uppercase tracking-widest text-black mb-4">
                    PHỔ BIẾN NHẤT
                  </div>
                )}
                <div className="mb-8">
                  <div className="text-sm font-bold uppercase tracking-wider text-gray-600 mb-2">
                    {plan.name}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-black">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-black flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setShowRegister(true)}
                  className={`w-full py-4 text-sm font-bold uppercase tracking-wider transition-all ${
                    plan.featured
                      ? 'bg-black text-white hover:bg-gray-800'
                      : 'bg-white text-black border-2 border-black hover:bg-black hover:text-white'
                  }`}
                >
                  Chọn gói này
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Bold */}
      <section className="py-32 bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">
            SẴN SÀNG BẮT ĐẦU?
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Tham gia cùng hàng ngàn người đang đạt được mục tiêu của họ mỗi ngày
          </p>
          <button
            onClick={() => setShowRegister(true)}
            className="px-12 py-4 bg-white text-black text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-all"
          >
            Bắt đầu miễn phí
          </button>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {[
              {
                title: 'SẢN PHẨM',
                links: ['Tính năng', 'Bảng giá', 'Roadmap', 'API'],
              },
              {
                title: 'CÔNG TY',
                links: ['Về chúng tôi', 'Blog', 'Tuyển dụng', 'Liên hệ'],
              },
              {
                title: 'HỖ TRỢ',
                links: ['Trợ giúp', 'Hướng dẫn', 'Điều khoản', 'Bảo mật'],
              },
              {
                title: 'THEO DÕI',
                links: ['Facebook', 'Twitter', 'Instagram', 'LinkedIn'],
              },
            ].map((column, index) => (
              <div key={index}>
                <div className="text-xs font-bold uppercase tracking-widest text-black mb-4">
                  {column.title}
                </div>
                <ul className="space-y-2">
                  {column.links.map((link, i) => (
                    <li key={i}>
                      <button className="text-sm text-gray-600 hover:text-black transition-colors">
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between">
            <div className="text-2xl font-black tracking-tighter text-black mb-4 md:mb-0">
              MYGOALS
            </div>
            <div className="text-xs text-gray-600">
              © 2024 MyGoals. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLogin && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowLogin(false)}
        >
          <div 
            className="bg-white max-w-md w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowLogin(false)}
              className="float-right text-black hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-3xl font-black text-black mb-8 tracking-tight uppercase">Đăng nhập</h2>

            <form className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:border-gray-600 transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-2">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:border-gray-600 transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/dashboard');
                }}
                className="w-full py-4 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-all"
              >
                Đăng nhập
              </button>

              <p className="text-center text-sm text-gray-600">
                Chưa có tài khoản?{' '}
                <button
                  onClick={() => {
                    setShowLogin(false);
                    setShowRegister(true);
                  }}
                  className="text-black font-bold hover:underline"
                >
                  Đăng ký ngay
                </button>
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegister && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowRegister(false)}
        >
          <div 
            className="bg-white max-w-md w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowRegister(false)}
              className="float-right text-black hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-3xl font-black text-black mb-8 tracking-tight uppercase">Đăng ký</h2>

            <form className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:border-gray-600 transition-colors"
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:border-gray-600 transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-2">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:border-gray-600 transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/dashboard');
                }}
                className="w-full py-4 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-all"
              >
                Đăng ký ngay
              </button>

              <p className="text-center text-sm text-gray-600">
                Đã có tài khoản?{' '}
                <button
                  onClick={() => {
                    setShowRegister(false);
                    setShowLogin(true);
                  }}
                  className="text-black font-bold hover:underline"
                >
                  Đăng nhập
                </button>
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeNew;

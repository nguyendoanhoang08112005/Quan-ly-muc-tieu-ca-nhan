import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [typedText, setTypedText] = useState('');
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const fullText = 'Biến Ước Mơ Thành Hiện Thực';

  // Parallax mouse effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Typing effect for title
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Detect scroll for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close modals on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowLogin(false);
        setShowRegister(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const features = [
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      title: 'Quản lý Task',
      description: 'Tạo và theo dõi các nhiệm vụ hàng ngày một cách dễ dàng với giao diện trực quan',
      color: 'from-purple-400 to-purple-600',
      hoverColor: 'group-hover:text-purple-200'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: 'Theo dõi Tiến độ',
      description: 'Xem biểu đồ trực quan về tiến trình đạt mục tiêu theo thời gian thực',
      color: 'from-blue-400 to-blue-600',
      hoverColor: 'group-hover:text-blue-200'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Nhắc nhở Thông minh',
      description: 'Không bỏ lỡ bất kỳ deadline nào với hệ thống nhắc nhở tự động',
      color: 'from-pink-400 to-pink-600',
      hoverColor: 'group-hover:text-pink-200'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Người dùng', icon: '👥' },
    { number: '50K+', label: 'Mục tiêu đã đạt', icon: '🎯' },
    { number: '98%', label: 'Hài lòng', icon: '⭐' },
    { number: '24/7', label: 'Hỗ trợ', icon: '💬' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 overflow-hidden relative">
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-purple-500/30 rounded-full blur-3xl -top-48 -left-48 animate-pulse"
          style={{ 
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: 'transform 0.5s ease-out'
          }}
        />
        <div 
          className="absolute w-96 h-96 bg-blue-500/30 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse"
          style={{ 
            transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
            transition: 'transform 0.5s ease-out',
            animationDelay: '1s'
          }}
        />
        <div 
          className="absolute w-72 h-72 bg-pink-500/20 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"
          style={{ 
            animationDelay: '2s'
          }}
        />
      </div>

      {/* Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-20 transition-all duration-500 ${
        isScrolled ? 'bg-white/10 backdrop-blur-md shadow-lg py-4' : 'backdrop-blur-sm bg-white/5 py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center space-x-3 cursor-pointer group" 
              onClick={() => navigate('/')}
            >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-bold text-2xl text-purple-600 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                M
              </div>
              <span className="text-white font-bold text-2xl group-hover:text-purple-200 transition-colors">
                My Goals
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 text-white font-medium hover:bg-white/10 rounded-lg transition-all flex items-center gap-2 border border-white/20 hover:border-white/40 hover:scale-105 group"
                aria-label="Xem demo ứng dụng"
              >
                <span className="text-lg group-hover:animate-bounce">🚀</span>
                <span>Xem Demo</span>
              </button>
              <button
                onClick={() => setShowLogin(true)}
                className="px-6 py-2.5 text-white font-medium hover:bg-white/10 rounded-lg transition-all hover:scale-105"
                aria-label="Đăng nhập vào tài khoản"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className="px-6 py-2.5 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-0.5"
                aria-label="Đăng ký tài khoản mới"
              >
                Đăng ký ngay
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-screen px-6 pt-20 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge with pulse animation */}
          <div className="mb-8 animate-fade-in">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 text-white rounded-full text-sm font-semibold backdrop-blur-md border border-white/30 hover:bg-white/20 transition-all cursor-default shadow-lg hover:shadow-xl hover:scale-105">
              <span className="animate-pulse">🎯</span>
              Quản lý mục tiêu thông minh
              <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full animate-pulse">NEW</span>
            </span>
          </div>

          {/* Main Title with typing effect */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-8 leading-tight">
            <span 
              className="inline-block"
              style={{
                transform: `translateY(${mousePosition.y * 0.1}px)`,
                transition: 'transform 0.3s ease-out'
              }}
            >
              {typedText}
              <span className="animate-pulse">|</span>
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-white/95 mb-12 max-w-3xl mx-auto leading-relaxed font-light animate-fade-in" style={{ animationDelay: '0.5s' }}>
            Công cụ quản lý mục tiêu cá nhân giúp bạn lập kế hoạch, theo dõi tiến độ 
            <br className="hidden md:block" />
            và đạt được những gì bạn mong muốn một cách dễ dàng.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16 animate-fade-in" style={{ animationDelay: '1s' }}>
            <button
              onClick={() => setShowRegister(true)}
              className="group relative px-10 py-4 bg-white text-purple-600 font-bold text-lg rounded-xl hover:bg-purple-50 transition-all shadow-2xl hover:shadow-purple-500/50 hover:scale-110 hover:-translate-y-1 w-full sm:w-auto overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-10 transition-opacity" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                Bắt đầu miễn phí
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="group px-10 py-4 bg-white/15 text-white font-bold text-lg rounded-xl hover:bg-white/25 transition-all backdrop-blur-md border-2 border-white/30 hover:border-white/50 hover:scale-110 hover:-translate-y-1 w-full sm:w-auto"
            >
              <span className="flex items-center justify-center gap-2">
                <span className="group-hover:animate-wave inline-block">👀</span>
                Xem Demo
              </span>
            </button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20 animate-fade-in" style={{ animationDelay: '1.5s' }}>
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/15 hover:scale-105 transition-all cursor-default group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 group-hover:animate-bounce inline-block">{stat.icon}</div>
                <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-white/80 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/15 hover:border-white/40 transition-all cursor-pointer hover:scale-105 hover:-translate-y-2 hover:shadow-2xl"
                onMouseEnter={() => setActiveFeature(index)}
                onMouseLeave={() => setActiveFeature(null)}
                style={{
                  animationDelay: `${2 + index * 0.2}s`
                }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-5 mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className={`text-2xl font-bold text-white mb-3 ${feature.hoverColor} transition-colors`}>
                  {feature.title}
                </h3>
                <p className="text-white/80 leading-relaxed">
                  {feature.description}
                </p>
                {activeFeature === index && (
                  <div className="mt-4 pt-4 border-t border-white/20 animate-fade-in">
                    <button className="text-white font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                      Tìm hiểu thêm
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Testimonial Preview */}
          <div className="mt-24 bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '2.5s' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl">
                👤
              </div>
              <div className="text-left">
                <div className="text-white font-bold text-lg">Nguyễn Văn A</div>
                <div className="text-white/70 text-sm">CEO tại ABC Company</div>
              </div>
              <div className="ml-auto flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-white/90 text-lg italic">
              "Ứng dụng này đã giúp tôi tổ chức công việc hiệu quả hơn rất nhiều. Giao diện đẹp, dễ sử dụng và đầy đủ tính năng!"
            </p>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-16 animate-bounce">
            <svg className="w-6 h-6 text-white/50 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Login Modal - Keep existing */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          {/* Existing login modal content */}
        </div>
      )}

      {/* Register Modal - Keep existing */}
      {showRegister && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          {/* Existing register modal content */}
        </div>
      )}
    </div>
  );
};

export default Home;

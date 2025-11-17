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
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHoveringCTA, setIsHoveringCTA] = useState(false);
  const [particleCount, setParticleCount] = useState(0);
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorTrail, setCursorTrail] = useState<Array<{x: number, y: number, id: number}>>([]);
  const [showCustomCursor, setShowCustomCursor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [buttonClicked, setButtonClicked] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [animatedNumbers, setAnimatedNumbers] = useState<{[key: number]: number}>({});
  const [copiedStat, setCopiedStat] = useState<number | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [activePricing, setActivePricing] = useState<'monthly' | 'yearly'>('monthly');
  const [liveVisitors, setLiveVisitors] = useState(0);
  const fullText = 'Biến Ước Mơ Thành Hiện Thực';

  // Simulate live visitors counter
  useEffect(() => {
    const baseVisitors = 234;
    setLiveVisitors(baseVisitors + Math.floor(Math.random() * 50));
    
    const interval = setInterval(() => {
      setLiveVisitors(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newValue = prev + change;
        return Math.max(baseVisitors, Math.min(baseVisitors + 100, newValue));
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Button click feedback
  const handleButtonClick = (buttonId: string) => {
    setButtonClicked(buttonId);
    setTimeout(() => setButtonClicked(null), 300);
  };

  // Parallax mouse effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Custom cursor trail effect
  useEffect(() => {
    if (isHoveringCTA) {
      const interval = setInterval(() => {
        setParticleCount(prev => (prev + 1) % 100);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isHoveringCTA]);

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

  // Entrance animation
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  // Progress bar on scroll
  useEffect(() => {
    const handleProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progressPercentage = (scrolled / documentHeight) * 100;
      setProgress(progressPercentage);
    };

    window.addEventListener('scroll', handleProgress);
    return () => window.removeEventListener('scroll', handleProgress);
  }, []);

  // Cursor trail effect
  useEffect(() => {
    let trailId = 0;
    const handleMouseTrail = (e: MouseEvent) => {
      if (showCustomCursor) {
        setCursorTrail(prev => {
          const newTrail = [...prev, { x: e.clientX, y: e.clientY, id: trailId++ }];
          return newTrail.slice(-15); // Keep only last 15 points
        });
      }
    };

    window.addEventListener('mousemove', handleMouseTrail);
    return () => window.removeEventListener('mousemove', handleMouseTrail);
  }, [showCustomCursor]);

  // Double click anywhere to scroll to top
  useEffect(() => {
    const handleDoubleClick = (e: MouseEvent) => {
      // Ignore double clicks on interactive elements
      const target = e.target as HTMLElement;
      if (!target.closest('button, a, input, textarea, select')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showToast('Đã cuộn lên đầu trang', 'success');
      }
    };

    document.addEventListener('dblclick', handleDoubleClick);
    return () => document.removeEventListener('dblclick', handleDoubleClick);
  }, []);

  // Page visibility - pause animations when tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setShowCustomCursor(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (pixels: number) => {
    window.scrollBy({ top: pixels, behavior: 'smooth' });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K: Open login
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowLogin(true);
        showToast('Nhấn ESC để đóng', 'info');
      }
      // Ctrl/Cmd + Shift + K: Open register
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'K') {
        e.preventDefault();
        setShowRegister(true);
        showToast('Nhấn ESC để đóng', 'info');
      }
      // Ctrl/Cmd + D: Go to dashboard
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        navigate('/dashboard');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);

  // Detect scroll for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 300);
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

  // Smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  // Simulate content loading for skeleton
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsContentLoaded(true);
    }, 800); // Simulate 800ms load time
    return () => clearTimeout(timer);
  }, []);

  // Password strength calculator
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength += 20;
    if (password.length >= 10) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 10;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  // Real-time email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Intersection Observer for stats animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsAnimated) {
            setStatsAnimated(true);
            // Animate numbers counting up
            const targetNumbers = [10000, 50000, 98, 24];
            targetNumbers.forEach((target, index) => {
              let current = 0;
              const increment = target / 60; // 60 steps for smooth animation
              const duration = 2000; // 2 seconds total
              const stepTime = duration / 60;
              
              const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                  current = target;
                  clearInterval(timer);
                }
                setAnimatedNumbers((prev) => ({ ...prev, [index]: Math.floor(current) }));
              }, stepTime);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    const statsSection = document.getElementById('stats-section');
    if (statsSection) {
      observer.observe(statsSection);
    }

    return () => {
      if (statsSection) {
        observer.unobserve(statsSection);
      }
    };
  }, [statsAnimated]);

  // Copy to clipboard function
  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedStat(index);
      showToast('Đã copy vào clipboard!', 'success');
      setTimeout(() => setCopiedStat(null), 2000);
    }).catch(() => {
      showToast('Không thể copy', 'error');
    });
  };

  const features = [
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      title: 'Quản lý Task',
      description: 'Tạo và theo dõi các nhiệm vụ hàng ngày một cách dễ dàng với giao diện trực quan',
      color: 'from-blue-400 to-blue-600',
      hoverColor: 'group-hover:text-blue-600'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      ),
      title: 'Theo dõi Tiến độ',
      description: 'Xem biểu đồ trực quan về tiến trình đạt mục tiêu theo thời gian thực',
      color: 'from-purple-400 to-purple-600',
      hoverColor: 'group-hover:text-purple-600'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      title: 'Nhắc nhở Thông minh',
      description: 'Không bỏ lỡ bất kỳ deadline nào với hệ thống nhắc nhở tự động',
      color: 'from-rose-400 to-pink-500',
      hoverColor: 'group-hover:text-rose-600'
    }
  ];

  const stats = [
    { 
      number: '10K+', 
      rawNumber: 10000,
      suffix: '+',
      label: 'Người dùng', 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    { 
      number: '50K+', 
      rawNumber: 50000,
      suffix: '+',
      label: 'Mục tiêu đã đạt', 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      number: '98%', 
      rawNumber: 98,
      suffix: '%',
      label: 'Hài lòng', 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    },
    { 
      number: '24/7', 
      rawNumber: 24,
      suffix: '/7',
      label: 'Hỗ trợ', 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      )
    }
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Đăng ký & Thiết lập',
      description: 'Tạo tài khoản miễn phí và thiết lập các mục tiêu cá nhân của bạn trong vài phút',
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      step: '02',
      title: 'Tạo Task & Lập Kế Hoạch',
      description: 'Chia nhỏ mục tiêu thành các task cụ thể và lên lịch trình thực hiện hợp lý',
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'from-purple-500 to-pink-500'
    },
    {
      step: '03',
      title: 'Theo Dõi Tiến Độ',
      description: 'Cập nhật tiến độ hàng ngày và theo dõi sự phát triển qua biểu đồ trực quan',
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'from-rose-500 to-orange-500'
    },
    {
      step: '04',
      title: 'Đạt Mục Tiêu',
      description: 'Hoàn thành mục tiêu và chia sẻ thành công với cộng đồng để tạo động lực',
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Hoàn hảo để bắt đầu',
      features: [
        'Tối đa 10 mục tiêu',
        'Tối đa 50 task/tháng',
        'Báo cáo cơ bản',
        'Hỗ trợ email',
        '1GB lưu trữ'
      ],
      color: 'from-gray-400 to-gray-500',
      popular: false
    },
    {
      name: 'Pro',
      price: { monthly: 99000, yearly: 990000 },
      description: 'Dành cho người dùng nghiêm túc',
      features: [
        'Không giới hạn mục tiêu',
        'Không giới hạn task',
        'Báo cáo nâng cao & AI insights',
        'Hỗ trợ ưu tiên 24/7',
        '10GB lưu trữ',
        'Tích hợp Calendar',
        'Export dữ liệu'
      ],
      color: 'from-blue-500 to-purple-600',
      popular: true
    },
    {
      name: 'Team',
      price: { monthly: 299000, yearly: 2990000 },
      description: 'Quản lý nhóm hiệu quả',
      features: [
        'Tất cả tính năng Pro',
        'Tối đa 10 thành viên',
        'Workspace riêng',
        'Quản lý phân quyền',
        'Analytics team',
        '50GB lưu trữ chung',
        'API access'
      ],
      color: 'from-purple-500 to-pink-500',
      popular: false
    }
  ];

  const faqs = [
    {
      question: 'Ứng dụng có miễn phí không?',
      answer: 'Có! Chúng tôi cung cấp gói Free hoàn toàn miễn phí với các tính năng cơ bản. Bạn có thể nâng cấp lên Pro hoặc Team khi cần thêm tính năng nâng cao.'
    },
    {
      question: 'Dữ liệu của tôi có được bảo mật không?',
      answer: 'Tất nhiên rồi! Chúng tôi sử dụng mã hóa SSL/TLS để bảo vệ dữ liệu. Tất cả thông tin được lưu trữ an toàn trên server và chỉ bạn mới có quyền truy cập.'
    },
    {
      question: 'Tôi có thể hủy đăng ký bất cứ lúc nào không?',
      answer: 'Có, bạn có thể hủy đăng ký bất cứ lúc nào mà không mất phí. Nếu hủy trong chu kỳ thanh toán, bạn vẫn có thể sử dụng đến hết kỳ hạn đã thanh toán.'
    },
    {
      question: 'Ứng dụng có hỗ trợ mobile không?',
      answer: 'Hiện tại chúng tôi hỗ trợ responsive web app hoạt động tốt trên mọi thiết bị. Ứng dụng mobile native đang được phát triển và sẽ ra mắt sớm.'
    },
    {
      question: 'Làm sao để liên hệ hỗ trợ?',
      answer: 'Bạn có thể liên hệ qua email support@mygoals.com hoặc chat trực tiếp trên website. Team hỗ trợ của chúng tôi làm việc 24/7 để giải đáp thắc mắc.'
    }
  ];

  return (
    <div 
      className="min-h-screen bg-white overflow-hidden relative"
      onMouseEnter={() => setShowCustomCursor(true)}
      onMouseLeave={() => setShowCustomCursor(false)}
    >
      {/* Minimalist Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(90deg, #000 1px, transparent 1px), linear-gradient(#000 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>
      {isScrolled && (
        <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 animate-slide-in-left hidden lg:block">
          <div className="flex flex-col gap-3 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border-2 border-gray-200">
            <button
              onClick={() => {
                document.getElementById('hero-section')?.scrollIntoView({ behavior: 'smooth' });
                showToast('Đang chuyển đến Hero', 'info');
              }}
              className="group relative w-12 h-12 flex items-center justify-center rounded-xl hover:bg-blue-50 transition-all hover:scale-110"
              aria-label="Chuyển đến Hero"
              title="Hero"
            >
              <svg className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Trang chủ
              </span>
            </button>
            <button
              onClick={() => {
                document.getElementById('stats-section')?.scrollIntoView({ behavior: 'smooth' });
                showToast('Đang chuyển đến Thống kê', 'info');
              }}
              className="group relative w-12 h-12 flex items-center justify-center rounded-xl hover:bg-purple-50 transition-all hover:scale-110"
              aria-label="Chuyển đến Stats"
              title="Stats"
            >
              <svg className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Thống kê
              </span>
            </button>
            <button
              onClick={() => {
                document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
                showToast('Đang chuyển đến Tính năng', 'info');
              }}
              className="group relative w-12 h-12 flex items-center justify-center rounded-xl hover:bg-rose-50 transition-all hover:scale-110"
              aria-label="Chuyển đến Features"
              title="Features"
            >
              <svg className="w-5 h-5 text-gray-600 group-hover:text-rose-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Tính năng
              </span>
            </button>
            <button
              onClick={() => {
                document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
                showToast('Đang chuyển đến Bảng giá', 'info');
              }}
              className="group relative w-12 h-12 flex items-center justify-center rounded-xl hover:bg-green-50 transition-all hover:scale-110"
              aria-label="Chuyển đến Pricing"
              title="Pricing"
            >
              <svg className="w-5 h-5 text-gray-600 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Bảng giá
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Social Proof */}
      {isVisible && (
        <div className="fixed right-6 bottom-24 z-30 animate-slide-in-right hidden lg:block">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border-2 border-gray-200 max-w-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse-slow">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  <span className="text-green-600">Minh Anh</span> vừa đạt mục tiêu
                </p>
                <p className="text-xs text-gray-600">2 phút trước</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Navigation - Floating Menu */}
      {isScrolled && false && (
        <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 animate-fade-in hidden lg:block">
          <div className="flex flex-col gap-3 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border-2 border-gray-200">
            <button
              onClick={() => {
                document.getElementById('hero-section')?.scrollIntoView({ behavior: 'smooth' });
                showToast('Đang chuyển đến Hero', 'info');
              }}
              className="group relative w-12 h-12 flex items-center justify-center rounded-xl hover:bg-blue-50 transition-all"
              aria-label="Chuyển đến Hero"
              title="Hero"
            >
              <svg className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>
            <button
              onClick={() => {
                document.getElementById('stats-section')?.scrollIntoView({ behavior: 'smooth' });
                showToast('Đang chuyển đến Thống kê', 'info');
              }}
              className="group relative w-12 h-12 flex items-center justify-center rounded-xl hover:bg-purple-50 transition-all"
              aria-label="Chuyển đến Stats"
              title="Stats"
            >
              <svg className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>
            <button
              onClick={() => {
                document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
                showToast('Đang chuyển đến Tính năng', 'info');
              }}
              className="group relative w-12 h-12 flex items-center justify-center rounded-xl hover:bg-rose-50 transition-all"
              aria-label="Chuyển đến Features"
              title="Features"
            >
              <svg className="w-5 h-5 text-gray-600 group-hover:text-rose-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 animate-slide-up">
          <div className={`px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md border-2 ${
            toast.type === 'success' ? 'bg-green-500/90 border-green-400 text-white' :
            toast.type === 'error' ? 'bg-red-500/90 border-red-400 text-white' :
            'bg-blue-500/90 border-blue-400 text-white'
          }`}>
            {toast.type === 'success' && (
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {toast.type === 'error' && (
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {toast.type === 'info' && (
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="font-semibold">{toast.message}</span>
            <button 
              onClick={() => setToast(null)}
              className="ml-2 hover:bg-white/20 rounded-full p-1 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Custom Cursor Trail */}
      {showCustomCursor && cursorTrail.map((point, index) => (
        <div
          key={point.id}
          className="fixed w-3 h-3 rounded-full pointer-events-none z-50 transition-all duration-300"
          style={{
            left: `${point.x}px`,
            top: `${point.y}px`,
            background: `radial-gradient(circle, rgba(255,255,255,${0.8 - index * 0.05}) 0%, transparent 70%)`,
            transform: `scale(${1 - index * 0.06}) translate(-50%, -50%)`,
            opacity: 1 - index * 0.07
          }}
        />
      ))}

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200">
        <div 
          className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-rose-400 transition-all duration-300 ease-out shadow-lg shadow-blue-400/30"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Interactive dots grid */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-300/30 rounded-full animate-pulse"
              style={{
                left: `${(i * 7) % 100}%`,
                top: `${(i * 13) % 100}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${3 + (i % 3)}s`,
                transform: `translate(${mousePosition.x * (i % 3) * 0.1}px, ${mousePosition.y * (i % 3) * 0.1}px)`,
                transition: 'transform 0.5s ease-out'
              }}
            />
          ))}
        </div>

        {/* Parallax circles */}
        <div 
          className="absolute w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -top-48 -left-48"
          style={{ 
            transform: `translate(${mousePosition.x * 1.5}px, ${mousePosition.y * 1.5}px)`,
            transition: 'transform 0.5s ease-out'
          }}
        />
        <div 
          className="absolute w-96 h-96 bg-purple-50/50 rounded-full blur-3xl -bottom-48 -right-48"
          style={{ 
            transform: `translate(${-mousePosition.x * 1.2}px, ${-mousePosition.y * 1.2}px)`,
            transition: 'transform 0.5s ease-out',
            animationDelay: '1s'
          }}
        />
        <div 
          className="absolute w-72 h-72 bg-pink-100/30 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ 
            animationDelay: '2s',
            transform: `translate(-50%, -50%) translate(${mousePosition.x * 0.8}px, ${mousePosition.y * 0.8}px)`,
            transition: 'transform 0.5s ease-out'
          }}
        />
      </div>

      {/* Floating Particles on Hover */}
      {isHoveringCTA && (
        <div className="fixed inset-0 pointer-events-none z-5">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
              style={{
                left: `${cursorPosition.x + (Math.random() - 0.5) * 100}px`,
                top: `${cursorPosition.y + (Math.random() - 0.5) * 100}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${2 + Math.random()}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Floating hint tooltip */}
      {isVisible && !showLogin && !showRegister && (
        <div className="fixed bottom-8 left-8 z-30 animate-fade-in hidden md:block" style={{ animationDelay: '3s' }}>
          <div className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-md px-5 py-3 rounded-xl border border-white/30 text-white shadow-lg hover:scale-105 transition-transform cursor-default">
            <div className="flex items-center gap-2 text-sm font-medium">
              <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>💡 Mẹo: Double-click để cuộn lên đầu trang</span>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Hint */}
      {isVisible && !showLogin && !showRegister && (
        <div className="fixed top-24 right-6 z-30 animate-fade-in hidden xl:block" style={{ animationDelay: '4s' }}>
          <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl border-2 border-gray-200 shadow-lg">
            <p className="text-xs font-semibold text-gray-700 mb-2">⌨️ Phím tắt:</p>
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-0.5 bg-gray-100 rounded text-gray-800 font-mono">Ctrl+K</kbd>
                <span>Đăng nhập</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-0.5 bg-gray-100 rounded text-gray-800 font-mono">Ctrl+D</kbd>
                <span>Dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-0.5 bg-gray-100 rounded text-gray-800 font-mono">ESC</kbd>
                <span>Đóng modal</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating hint tooltip */}
      {isVisible && !showLogin && !showRegister && false && (
        <div className="fixed bottom-8 left-8 z-30 animate-fade-in" style={{ animationDelay: '2s' }}>
          <div className="bg-white/15 backdrop-blur-md px-5 py-3 rounded-xl border border-white/30 text-white shadow-lg">
            <div className="flex items-center gap-2 text-sm font-medium">
              <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>Nhấp đúp vào bất kỳ đâu để cuộn lên đầu</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-20 transition-all duration-500 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-4' : 'backdrop-blur-sm bg-white/80 py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center space-x-3 cursor-pointer group" 
              onClick={() => navigate('/')}
            >
              <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center font-bold text-2xl text-white shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 overflow-hidden">
                <span className="relative z-10">M</span>
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                {/* Pulse ring on hover */}
                <div className="absolute inset-0 border-2 border-blue-400 rounded-xl opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500" />
              </div>
              <span className="text-gray-800 font-bold text-2xl group-hover:text-blue-600 transition-colors relative">
                My Goals
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
              </span>
            </div>
            
            {/* Live Visitors Counter */}
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full animate-pulse-slow">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-green-700">
                {liveVisitors} người đang online
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={() => {
                  setDarkMode(!darkMode);
                  showToast(darkMode ? 'Chế độ sáng đã bật' : 'Chế độ tối đang được phát triển', 'info');
                }}
                className="p-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-all hover:scale-110 relative group"
                aria-label="Toggle dark mode"
                title="Đổi chế độ sáng/tối"
              >
                {darkMode ? (
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {darkMode ? 'Sáng' : 'Tối'}
                </span>
              </button>

              <button
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 text-gray-700 font-medium hover:bg-blue-50 rounded-lg transition-all flex items-center gap-2 border border-gray-200 hover:border-blue-300 hover:scale-105 group relative overflow-hidden"
                aria-label="Xem demo ứng dụng"
                title="Nhấn Ctrl+D để truy cập nhanh"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                <svg className="relative w-5 h-5 text-blue-600 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
                <span className="relative">Xem Demo</span>
              </button>
              <button
                onClick={() => {
                  setShowLogin(true);
                  showToast('Nhấn Tab để di chuyển giữa các trường', 'info');
                }}
                className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-all hover:scale-105 relative overflow-hidden group"
                aria-label="Đăng nhập vào tài khoản (Ctrl+K)"
                title="Nhấn Ctrl+K để mở"
              >
                <span className="absolute inset-0 bg-gray-50 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative">Đăng nhập</span>
              </button>
              <button
                onClick={() => {
                  setShowRegister(true);
                  showToast('Chỉ mất 30 giây để tạo tài khoản!', 'info');
                }}
                className="relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-0.5 group overflow-hidden"
                aria-label="Đăng ký tài khoản mới (Ctrl+Shift+K)"
                title="Nhấn Ctrl+Shift+K để mở"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative">Đăng ký ngay</span>
                <span className="absolute inset-0 border-2 border-blue-300 rounded-lg opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div id="hero-section" className="flex items-center justify-center min-h-screen px-6 pt-20 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge with pulse animation */}
          <div className="mb-8 animate-fade-in group/badge">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 rounded-full text-sm font-semibold backdrop-blur-md border border-blue-200 hover:border-blue-300 transition-all cursor-default shadow-lg hover:shadow-xl hover:scale-105 relative overflow-hidden">
              {/* Shimmer effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover/badge:translate-x-full transition-transform duration-1000" />
              <svg className="relative w-5 h-5 text-blue-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span className="relative">Quản lý mục tiêu thông minh</span>
              <span className="relative px-2 py-0.5 bg-green-500 text-white text-xs rounded-full animate-pulse shadow-lg shadow-green-500/50">NEW</span>
            </span>
          </div>

          {/* Main Title with typing effect */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-gray-800 mb-8 leading-tight relative">
            <span 
              className="inline-block bg-gradient-to-r from-blue-600 via-purple-500 to-rose-500 bg-clip-text text-transparent animate-scale-in"
              style={{
                transform: `translateY(${mousePosition.y * 0.1}px)`,
                transition: 'transform 0.3s ease-out',
                backgroundSize: '200% auto'
              }}
            >
              {typedText}
              <span className="animate-pulse">|</span>
            </span>
            {/* Glow effect under title */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent blur-xl" />
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light animate-fade-in hover:text-gray-800 transition-colors cursor-default relative group/desc" style={{ animationDelay: '0.5s' }}>
            <span className="relative z-10">
              Công cụ quản lý mục tiêu cá nhân giúp bạn lập kế hoạch, theo dõi tiến độ 
              <br className="hidden md:block" />
              và đạt được những gì bạn mong muốn một cách dễ dàng.
            </span>
            {/* Subtle highlight on hover */}
            <span className="absolute inset-0 bg-blue-50/50 rounded-2xl opacity-0 group-hover/desc:opacity-100 transition-opacity -z-10 blur-xl" />
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16 animate-fade-in" style={{ animationDelay: '1s' }}>
            <button
              onClick={() => {
                handleButtonClick('cta-register');
                setShowRegister(true);
                showToast('Chào mừng! Hãy tạo tài khoản để bắt đầu 🎉', 'info');
              }}
              onMouseEnter={() => setIsHoveringCTA(true)}
              onMouseLeave={() => setIsHoveringCTA(false)}
              className={`group relative px-10 py-4 bg-gradient-to-r from-blue-600 via-purple-500 to-rose-500 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:via-purple-600 hover:to-rose-600 transition-all shadow-2xl hover:shadow-blue-500/50 hover:scale-110 hover:-translate-y-1 w-full sm:w-auto overflow-hidden ${
                buttonClicked === 'cta-register' ? 'scale-95' : ''
              }`}
              aria-label="Bắt đầu sử dụng miễn phí"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-full group-hover:translate-x-full duration-700" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-5 h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Bắt đầu miễn phí
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
            <button 
              onClick={() => {
                handleButtonClick('cta-demo');
                navigate('/dashboard');
                showToast('Đang chuyển đến Dashboard...', 'info');
              }}
              className={`group relative px-10 py-4 bg-white text-gray-700 font-bold text-lg rounded-xl hover:bg-gray-50 transition-all backdrop-blur-md border-2 border-gray-200 hover:border-blue-300 hover:scale-110 hover:-translate-y-1 w-full sm:w-auto overflow-hidden ${
                buttonClicked === 'cta-demo' ? 'scale-95' : ''
              }`}
              aria-label="Xem demo ứng dụng"
            >
              <span className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-100 animate-pulse"></span>
              </span>
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-blue-600 group-hover:animate-wave inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                Xem Demo
              </span>
            </button>
          </div>

          {/* Stats Section */}
          <div id="stats-section" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20 animate-fade-in" style={{ animationDelay: '1.5s' }}>
            {!isContentLoaded ? (
              // Skeleton loading for stats
              [...Array(4)].map((_, index) => (
                <div key={index} className="relative bg-white/90 backdrop-blur-md p-6 rounded-2xl border-2 border-gray-200 shadow-lg animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-20 mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              ))
            ) : (
              stats.map((stat, index) => (
              <div 
                key={index}
                onMouseEnter={() => {
                  setHoveredStat(index);
                  handleButtonClick(`stat-${index}`);
                }}
                onMouseLeave={() => setHoveredStat(null)}
                onClick={() => showToast(`${stat.label}: ${stat.number}`, 'info')}
                className={`relative bg-white/90 backdrop-blur-md p-6 rounded-2xl border-2 border-gray-200 hover:bg-white hover:border-blue-300 hover:scale-110 transition-all cursor-pointer group overflow-hidden shadow-lg hover:shadow-xl ${
                  buttonClicked === `stat-${index}` ? 'scale-95' : ''
                }`}
                role="button"
                tabIndex={0}
                aria-label={`${stat.label}: ${stat.number}`}
              >
                {/* Animated border glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-purple-100 to-rose-100 animate-spin-slow blur-xl" />
                </div>
                <div className="relative z-10">
                  <div className="text-blue-600 mb-2 inline-block transition-transform duration-300 group-hover:scale-125 group-hover:animate-bounce">{stat.icon}</div>
                  <div 
                    className="text-3xl font-bold text-gray-800 mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-500 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(stat.number, index);
                    }}
                  >
                    {statsAnimated && animatedNumbers[index] !== undefined
                      ? index === 0 
                        ? `${(animatedNumbers[index] / 1000).toFixed(0)}K${stat.suffix}`
                        : index === 1
                        ? `${(animatedNumbers[index] / 1000).toFixed(0)}K${stat.suffix}`
                        : `${animatedNumbers[index]}${stat.suffix}`
                      : stat.number}
                    {copiedStat === index && (
                      <svg className="inline-block w-5 h-5 ml-2 text-green-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="text-gray-600 text-sm font-medium group-hover:text-gray-800 group-hover:font-semibold transition-all">{stat.label}</div>
                  {/* Click hint */}
                  <div className="mt-2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Click số để copy
                  </div>
                </div>
                {/* Ripple effect on hover */}
                {hoveredStat === index && (
                  <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-blue-100/50 rounded-2xl animate-ping" />
                  </div>
                )}
              </div>
              ))
            )}
          </div>

          {/* Features Section */}
          <div id="features-section" className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-white/90 backdrop-blur-md p-8 rounded-2xl border-2 border-gray-200 hover:bg-white hover:border-blue-300 transition-all cursor-pointer hover:scale-110 hover:-translate-y-3 hover:shadow-2xl hover:shadow-blue-200/50 relative overflow-hidden"
                onMouseEnter={() => {
                  setActiveFeature(index);
                  handleButtonClick(`feature-${index}`);
                }}
                onMouseLeave={() => setActiveFeature(null)}
                onClick={() => showToast(`${feature.title} - Sắp ra mắt!`, 'info')}
                style={{
                  animationDelay: `${2 + index * 0.2}s`
                }}
                role="button"
                tabIndex={0}
                aria-label={`Xem thêm về ${feature.title}`}
              >
                {/* Shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>

                <div className={`relative w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-5 mx-auto group-hover:scale-125 group-hover:rotate-12 transition-all shadow-lg group-hover:shadow-2xl`}>
                  {feature.icon}
                  {/* Icon pulse effect */}
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500" />
                </div>
                <h3 className={`text-2xl font-bold text-gray-800 mb-3 ${feature.hoverColor} transition-colors group-hover:scale-105`}>
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors">
                  {feature.description}
                </p>
                {activeFeature === index && (
                  <div className="mt-4 pt-4 border-t border-gray-200 animate-fade-in">
                    <button className="text-blue-600 font-semibold flex items-center gap-2 hover:gap-4 transition-all group/btn">
                      Tìm hiểu thêm
                      <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Testimonial Preview */}
          <div className="mt-24 animate-fade-in" style={{ animationDelay: '2.5s' }}>
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Người dùng nói gì về chúng tôi
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                {
                  name: 'Nguyễn Văn A',
                  role: 'CEO tại ABC Company',
                  avatar: 'from-yellow-400 to-orange-500',
                  rating: 5,
                  text: '"Ứng dụng này đã giúp tôi tổ chức công việc hiệu quả hơn rất nhiều. Giao diện đẹp, dễ sử dụng và đầy đủ tính năng!"',
                  verified: true
                },
                {
                  name: 'Trần Thị B',
                  role: 'Product Manager',
                  avatar: 'from-pink-400 to-rose-500',
                  rating: 5,
                  text: '"Tính năng Pomodoro và theo dõi tiến độ rất xuất sắc. Giúp tôi tập trung và hoàn thành nhiều việc hơn!"',
                  verified: true
                },
                {
                  name: 'Lê Văn C',
                  role: 'Freelancer',
                  avatar: 'from-blue-400 to-cyan-500',
                  rating: 5,
                  text: '"Quản lý nhiều dự án trở nên dễ dàng hơn bao giờ hết. Đội ngũ support cũng rất tận tình và nhiệt tình!"',
                  verified: true
                }
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="group bg-white/90 backdrop-blur-md p-6 rounded-2xl border-2 border-gray-200 hover:bg-white hover:border-blue-300 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-200/50 cursor-pointer"
                  onClick={() => showToast(`Cảm ơn ${testimonial.name.split(' ')[0]}! ⭐`, 'success')}
                  role="button"
                  tabIndex={0}
                  aria-label={`Xem đánh giá từ ${testimonial.name}`}
                  style={{ animationDelay: `${2.5 + index * 0.15}s` }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.avatar} rounded-full flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-gray-800 font-bold group-hover:text-blue-600 transition-colors flex items-center gap-2">
                        {testimonial.name}
                        {testimonial.verified && (
                          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="text-gray-600 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform" style={{ transitionDelay: `${i * 0.05}s` }} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  
                  <p className="text-gray-700 italic group-hover:text-gray-900 transition-colors leading-relaxed">
                    {testimonial.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial Preview - Old */}
          <div className="hidden">
            <div 
              className="group mt-24 bg-white/90 backdrop-blur-md p-8 rounded-2xl border-2 border-gray-200 hover:bg-white hover:border-blue-300 transition-all max-w-3xl mx-auto animate-fade-in hover:scale-105 hover:shadow-2xl hover:shadow-blue-200/50 cursor-pointer" 
              style={{ animationDelay: '2.5s' }}
              onClick={() => showToast('Cảm ơn bạn đã quan tâm! ⭐', 'success')}
              role="button"
              tabIndex={0}
              aria-label="Xem đánh giá từ người dùng"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-gray-800 font-bold text-lg group-hover:text-blue-600 transition-colors">Nguyễn Văn A</div>
                  <div className="text-gray-600 text-sm">CEO tại ABC Company</div>
                </div>
                <div className="ml-auto flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform" style={{ transitionDelay: `${i * 0.05}s` }} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 text-lg italic group-hover:text-gray-900 transition-colors">
                "Ứng dụng này đã giúp tôi tổ chức công việc hiệu quả hơn rất nhiều. Giao diện đẹp, dễ sử dụng và đầy đủ tính năng!"
              </p>
              <div className="mt-4 pt-4 border-t border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Đã xác minh</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div 
            className="mt-16 group cursor-pointer animate-bounce-slow hover:animate-bounce"
            onClick={() => {
              window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
              showToast('Đang cuộn xuống...', 'info');
            }}
            role="button"
            tabIndex={0}
            aria-label="Cuộn xuống để xem thêm"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-gray-600 text-sm font-medium group-hover:text-gray-800 transition-colors">Cuộn xuống để khám phá</span>
              <div className="relative">
                <svg className="w-6 h-6 text-gray-400 mx-auto group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <div className="absolute inset-0 bg-blue-200/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 px-6 relative z-10 bg-gradient-to-b from-transparent to-blue-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
              QUY TRÌNH
            </span>
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Cách Hoạt Động
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Chỉ 4 bước đơn giản để bắt đầu hành trình đạt mục tiêu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div 
                key={index}
                className="relative group"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Connection Line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                  </div>
                )}

                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-3 border-2 border-gray-100 hover:border-blue-200 cursor-pointer">
                  {/* Step Number */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg transform group-hover:rotate-12 transition-transform">
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform shadow-lg`}>
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center group-hover:text-blue-600 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-24 px-6 relative z-10" id="pricing-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
              BẢNG GIÁ
            </span>
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Chọn Gói Phù Hợp
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Linh hoạt, minh bạch và không ràng buộc dài hạn
            </p>

            {/* Pricing Toggle */}
            <div className="inline-flex items-center bg-white rounded-full p-1.5 shadow-lg border-2 border-gray-200">
              <button
                onClick={() => setActivePricing('monthly')}
                className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
                  activePricing === 'monthly'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Hàng tháng
              </button>
              <button
                onClick={() => setActivePricing('yearly')}
                className={`px-6 py-2.5 rounded-full font-semibold transition-all relative ${
                  activePricing === 'yearly'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Hàng năm
                <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                  -17%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border-2 ${
                  plan.popular ? 'border-blue-500 scale-105' : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold rounded-full shadow-lg">
                    PHỔ BIẾN NHẤT
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900">
                      {plan.price[activePricing].toLocaleString('vi-VN')}
                    </span>
                    <span className="text-gray-600 ml-2">
                      {plan.price[activePricing] > 0 ? '₫/' + (activePricing === 'monthly' ? 'tháng' : 'năm') : ''}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      showToast(`Đăng ký gói ${plan.name} thành công!`, 'success');
                      setShowRegister(true);
                    }}
                    className={`w-full py-3.5 rounded-xl font-bold transition-all hover:scale-105 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Bắt đầu ngay
                  </button>
                </div>

                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-24 px-6 relative z-10 bg-gradient-to-b from-blue-50/30 to-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-rose-100 text-rose-700 rounded-full text-sm font-semibold mb-4">
              CÂU HỎI THƯỜNG GẶP
            </span>
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Giải Đáp Thắc Mắc
            </h2>
            <p className="text-xl text-gray-600">
              Những câu hỏi phổ biến từ người dùng
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-gray-100 hover:border-blue-200 overflow-hidden"
              >
                <button
                  onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-6 h-6 text-blue-600 flex-shrink-0 transition-transform ${
                      activeFAQ === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeFAQ === index && (
                  <div className="px-8 pb-6 animate-fade-in">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Vẫn còn thắc mắc?</p>
            <button
              onClick={() => showToast('Hãy liên hệ support@mygoals.com', 'info')}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Liên hệ hỗ trợ
            </button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-rose-600 rounded-3xl p-12 md:p-16 shadow-2xl overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '30px 30px'
              }} />
            </div>

            <div className="relative z-10 text-center text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Sẵn sàng bắt đầu chưa?
              </h2>
              <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto">
                Tham gia cùng hàng ngàn người đang đạt được mục tiêu của họ mỗi ngày
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => {
                    setShowRegister(true);
                    showToast('Chào mừng đến với My Goals! 🎉', 'success');
                  }}
                  className="px-10 py-4 bg-white text-blue-600 font-bold text-lg rounded-xl hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl hover:scale-110 hover:-translate-y-1"
                >
                  Bắt đầu miễn phí
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-10 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-xl hover:bg-white/10 transition-all hover:scale-110 hover:-translate-y-1"
                >
                  Xem demo
                </button>
              </div>
              <p className="mt-6 text-blue-100 text-sm">
                ✨ Không cần thẻ tín dụng • Miễn phí mãi mãi
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center font-bold text-2xl text-white">
                  M
                </div>
                <span className="text-white font-bold text-2xl">My Goals</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Công cụ quản lý mục tiêu cá nhân thông minh giúp bạn đạt được những gì bạn mong muốn.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all hover:scale-110" aria-label="Facebook">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-400 rounded-lg flex items-center justify-center transition-all hover:scale-110" aria-label="Twitter">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-all hover:scale-110" aria-label="Instagram">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Sản phẩm</h3>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Tính năng</a></li>
                <li><a href="#pricing-section" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Bảng giá</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Roadmap</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Changelog</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Công ty</h3>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Về chúng tôi</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Tuyển dụng</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Đối tác</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Liên hệ</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Hỗ trợ</h3>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Trung tâm trợ giúp</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Hướng dẫn</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Điều khoản dịch vụ</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Chính sách bảo mật</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Cookies</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-400 text-sm">
                © 2024 My Goals. All rights reserved. Made with ❤️ in Vietnam
              </p>
              <div className="flex items-center gap-6 text-sm">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-30 p-4 bg-white text-blue-600 rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-110 transition-all animate-fade-in group relative overflow-hidden border-2 border-gray-200"
          aria-label="Cuộn lên đầu trang"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="absolute inset-0 border-2 border-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500" />
          <svg className="relative w-6 h-6 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      {/* Floating Action Hint */}
      <div className="fixed bottom-8 left-8 z-30 animate-fade-in">
        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border-2 border-gray-200 text-gray-700 text-sm flex items-center gap-2 hover:bg-white hover:border-blue-300 transition-all cursor-default shadow-lg">
          <span className="animate-pulse">💡</span>
          <span>Di chuyển chuột để xem hiệu ứng!</span>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setShowLogin(false)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative transform transition-all animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-all"
              aria-label="Đóng modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Chào mừng trở lại!</h2>
              <p className="text-gray-600">Đăng nhập để tiếp tục</p>
            </div>

            <form className="space-y-5" onSubmit={(e) => {
              e.preventDefault();
              setIsLoading(true);
              showToast('Đang đăng nhập...', 'info');
              
              // Simulate API call
              setTimeout(() => {
                setIsLoading(false);
                showToast('Đăng nhập thành công!', 'success');
                setTimeout(() => {
                  navigate('/dashboard');
                }, 500);
              }, 1500);
            }}>
              <div>
                <label htmlFor="login-email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="your@email.com"
                  className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-2 outline-none transition-all ${
                    formErrors['login-email'] 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-300'
                  }`}
                  autoComplete="email"
                  autoFocus
                  required
                  disabled={isLoading}
                  onFocus={() => setFocusedInput('login-email')}
                  onBlur={(e) => {
                    setFocusedInput(null);
                    const email = e.target.value;
                    if (email && !validateEmail(email)) {
                      setFormErrors(prev => ({ ...prev, 'login-email': 'Email không hợp lệ' }));
                    } else {
                      setFormErrors(prev => { const newErrors = {...prev}; delete newErrors['login-email']; return newErrors; });
                    }
                  }}
                  onChange={() => {
                    if (formErrors['login-email']) {
                      setFormErrors(prev => { const newErrors = {...prev}; delete newErrors['login-email']; return newErrors; });
                    }
                  }}
                />
                {formErrors['login-email'] && (
                  <p className="mt-1 text-xs text-red-600 animate-fade-in flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formErrors['login-email']}
                  </p>
                )}
                {focusedInput === 'login-email' && !formErrors['login-email'] && (
                  <p className="mt-1 text-xs text-gray-500 animate-fade-in">Nhập email của bạn để đăng nhập</p>
                )}
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-300"
                  autoComplete="current-password"
                  required
                  disabled={isLoading}
                  minLength={6}
                  onFocus={() => setFocusedInput('login-password')}
                  onBlur={() => setFocusedInput(null)}
                />
                {focusedInput === 'login-password' && (
                  <p className="mt-1 text-xs text-gray-500 animate-fade-in">Mật khẩu tối thiểu 6 ký tự</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer group">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" disabled={isLoading} />
                  <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900">Ghi nhớ đăng nhập</span>
                </label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline" onClick={(e) => {
                  e.preventDefault();
                  showToast('Tính năng đang phát triển', 'info');
                }}>
                  Quên mật khẩu?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3.5 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <span>Đăng nhập ngay</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
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
                  className="text-blue-600 font-bold hover:text-blue-700 hover:underline"
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
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setShowRegister(false)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative transform transition-all animate-slide-up max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowRegister(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-all z-10"
              aria-label="Đóng modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Tạo tài khoản mới</h2>
              <p className="text-gray-600">Hoàn toàn miễn phí, mãi mãi!</p>
            </div>

            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const password = (form.elements.namedItem('register-password') as HTMLInputElement).value;
              const confirmPassword = (form.elements.namedItem('register-confirm-password') as HTMLInputElement).value;
              
              if (password !== confirmPassword) {
                showToast('Mật khẩu không khớp!', 'error');
                return;
              }

              setIsLoading(true);
              showToast('Đang tạo tài khoản...', 'info');
              
              setTimeout(() => {
                setIsLoading(false);
                showToast('Đăng ký thành công!', 'success');
                setTimeout(() => {
                  navigate('/dashboard');
                }, 500);
              }, 1500);
            }}>
              <div>
                <label htmlFor="register-name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Họ và tên
                </label>
                <input
                  id="register-name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-300"
                  autoComplete="name"
                  autoFocus
                  required
                  disabled={isLoading}
                  minLength={2}
                  onFocus={() => setFocusedInput('register-name')}
                  onBlur={() => setFocusedInput(null)}
                />
                {focusedInput === 'register-name' && (
                  <p className="mt-1 text-xs text-gray-500 animate-fade-in">Nhập họ và tên đầy đủ của bạn</p>
                )}
              </div>

              <div>
                <label htmlFor="register-email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="register-email"
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-300"
                  autoComplete="email"
                  required
                  disabled={isLoading}
                  onFocus={() => setFocusedInput('register-email')}
                  onBlur={() => setFocusedInput(null)}
                />
                {focusedInput === 'register-email' && (
                  <p className="mt-1 text-xs text-gray-500 animate-fade-in">Email sẽ được dùng để đăng nhập</p>
                )}
              </div>

              <div>
                <label htmlFor="register-password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <input
                  id="register-password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-300"
                  autoComplete="new-password"
                  required
                  disabled={isLoading}
                  minLength={6}
                  onFocus={() => {
                    setFocusedInput('register-password');
                    setShowPasswordStrength(true);
                  }}
                  onBlur={() => {
                    setFocusedInput(null);
                    setShowPasswordStrength(false);
                  }}
                  onChange={(e) => {
                    const strength = calculatePasswordStrength(e.target.value);
                    setPasswordStrength(strength);
                  }}
                />
                {focusedInput === 'register-password' && (
                  <p className="mt-1 text-xs text-gray-500 animate-fade-in">Mật khẩu tối thiểu 6 ký tự</p>
                )}
                {/* Password strength indicator */}
                {showPasswordStrength && (
                  <div className="mt-2 animate-fade-in">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            passwordStrength < 40 ? 'bg-red-500' : 
                            passwordStrength < 70 ? 'bg-yellow-500' : 
                            'bg-green-500'
                          }`}
                          style={{ width: `${passwordStrength}%` }}
                        />
                      </div>
                      <span className={`text-xs font-semibold ${
                        passwordStrength < 40 ? 'text-red-500' : 
                        passwordStrength < 70 ? 'text-yellow-600' : 
                        'text-green-600'
                      }`}>
                        {passwordStrength < 40 ? 'Yếu' : passwordStrength < 70 ? 'Trung bình' : 'Mạnh'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Dùng chữ hoa, chữ thường, số và ký tự đặc biệt để tăng độ mạnh
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="register-confirm-password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Xác nhận mật khẩu
                </label>
                <input
                  id="register-confirm-password"
                  name="register-confirm-password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-300"
                  autoComplete="new-password"
                  required
                  disabled={isLoading}
                  minLength={6}
                  onFocus={() => setFocusedInput('register-confirm-password')}
                  onBlur={() => setFocusedInput(null)}
                />
                {focusedInput === 'register-confirm-password' && (
                  <p className="mt-1 text-xs text-gray-500 animate-fade-in">Nhập lại mật khẩu để xác nhận</p>
                )}
              </div>

              <div className="flex items-start pt-2">
                <input 
                  type="checkbox" 
                  id="terms"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1 cursor-pointer" 
                  required
                  disabled={isLoading}
                />
                <label htmlFor="terms" className="ml-2.5 text-sm text-gray-600 leading-relaxed cursor-pointer">
                  Tôi đồng ý với{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline" onClick={(e) => {
                    e.preventDefault();
                    showToast('Điều khoản dịch vụ', 'info');
                  }}>
                    Điều khoản dịch vụ
                  </a>{' '}
                  và{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline" onClick={(e) => {
                    e.preventDefault();
                    showToast('Chính sách bảo mật', 'info');
                  }}>
                    Chính sách bảo mật
                  </a>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3.5 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 mt-6 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <span>Tạo tài khoản</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
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
                  className="text-blue-600 font-bold hover:text-blue-700 hover:underline"
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

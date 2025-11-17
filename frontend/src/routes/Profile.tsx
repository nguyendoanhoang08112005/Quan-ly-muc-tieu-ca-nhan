import { useState, useRef } from 'react';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon,
  CalendarIcon,
  CameraIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  KeyIcon,
  BellIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  TrophyIcon,
  FireIcon,
  ClockIcon,
  ArrowUpTrayIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'stats'>('profile');
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [userData, setUserData] = useState({
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '+84 123 456 789',
    location: 'Hà Nội, Việt Nam',
    job: 'Full Stack Developer',
    bio: 'Passionate about technology and personal growth. Always learning and improving.',
    joinDate: '15/01/2024',
    avatar: '',
  });

  const [editData, setEditData] = useState(userData);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    publicProfile: false,
  });

  const stats = [
    { label: 'Mục tiêu hoàn thành', value: 47, icon: TrophyIcon, color: 'text-yellow-500', bgColor: 'bg-yellow-50' },
    { label: 'Streak hiện tại', value: 12, unit: 'ngày', icon: FireIcon, color: 'text-red-600', bgColor: 'bg-red-50' },
    { label: 'Tổng giờ làm việc', value: 328, unit: 'giờ', icon: ClockIcon, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Task hoàn thành', value: 156, icon: CheckIcon, color: 'text-green-600', bgColor: 'bg-green-50' },
  ];

  const achievements = [
    { title: 'First Goal', desc: 'Hoàn thành mục tiêu đầu tiên', date: '20/01/2024', color: 'bg-yellow-500' },
    { title: '10 Day Streak', desc: 'Làm việc liên tục 10 ngày', date: '05/02/2024', color: 'bg-red-600' },
    { title: 'Early Bird', desc: 'Đăng nhập trước 6AM', date: '12/02/2024', color: 'bg-blue-600' },
    { title: 'Overachiever', desc: 'Hoàn thành 50 mục tiêu', date: '01/03/2024', color: 'bg-green-600' },
  ];

  const handleSave = () => {
    setUserData(editData);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            // Here you would normally set the actual avatar URL
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const handlePasswordChange = () => {
    if (passwordData.new !== passwordData.confirm) {
      alert('Mật khẩu mới không khớp!');
      return;
    }
    // Handle password change logic
    alert('Đổi mật khẩu thành công!');
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  const validatePassword = (password: string) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
    };
  };

  const passwordStrength = validatePassword(passwordData.new);

  const tabs = [
    { id: 'profile', label: 'Thông tin', icon: UserCircleIcon },
    { id: 'security', label: 'Bảo mật', icon: ShieldCheckIcon },
    { id: 'stats', label: 'Thống kê', icon: ChartBarIcon },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Success Toast */}
      {saveSuccess && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-6 py-4 shadow-xl border-2 border-black flex items-center gap-3 animate-slide-in-right">
          <CheckCircleIcon className="w-6 h-6 stroke-2" />
          <div>
            <div className="font-black uppercase text-sm">Thành công!</div>
            <div className="text-xs">Đã lưu thông tin của bạn</div>
          </div>
        </div>
      )}

      {/* Header - Black Background */}
      <div className="bg-black text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 bg-white text-black flex items-center justify-center text-5xl font-black border-4 border-white relative overflow-hidden">
                {userData.name.charAt(0).toUpperCase()}
                
                {/* Upload Progress Overlay */}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
                    <div className="text-white text-sm font-bold mb-2">{uploadProgress}%</div>
                    <div className="w-20 h-1 bg-gray-600">
                      <div 
                        className="h-full bg-white transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-10 h-10 bg-red-600 hover:bg-red-700 flex items-center justify-center transition-all group-hover:scale-110"
              >
                <CameraIcon className="w-5 h-5 text-white stroke-2" />
              </button>
              
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-600 border-4 border-black animate-pulse"></div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-black mb-2 uppercase tracking-tight">{userData.name}</h1>
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-4">{userData.job}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4" />
                  {userData.location}
                </span>
                <span className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Tham gia {userData.joinDate}
                </span>
              </div>
            </div>

            {/* Edit Button */}
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-white text-black hover:bg-gray-200 transition-all font-bold uppercase tracking-wider text-sm flex items-center gap-2"
              >
                <PencilIcon className="w-5 h-5 stroke-2" />
                Chỉnh sửa
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-green-600 text-white hover:bg-green-700 transition-all font-bold uppercase tracking-wider text-sm flex items-center gap-2"
                >
                  <CheckIcon className="w-5 h-5 stroke-2" />
                  Lưu
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 bg-red-600 text-white hover:bg-red-700 transition-all font-bold uppercase tracking-wider text-sm flex items-center gap-2"
                >
                  <XMarkIcon className="w-5 h-5 stroke-2" />
                  Hủy
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-gray-50 border-b-2 border-black py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 ${stat.bgColor} mb-3`}>
                    <Icon className={`w-6 h-6 ${stat.color} stroke-2`} />
                  </div>
                  <div className="text-3xl font-black text-black mb-1">
                    {stat.value}
                    {stat.unit && <span className="text-lg text-gray-500 ml-1">{stat.unit}</span>}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-gray-500 font-bold">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b-2 border-black bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 font-bold uppercase tracking-wider text-sm transition-all ${
                    activeTab === tab.id
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="border-2 border-black p-6">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                  <UserCircleIcon className="w-6 h-6 stroke-2" />
                  Thông tin cá nhân
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                      Họ và tên *
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-bold transition-all"
                        placeholder="Nhập họ và tên"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 font-bold group-hover:bg-gray-100 transition-all">{userData.name}</div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                      <EnvelopeIcon className="w-4 h-4 inline mr-2" />
                      Email *
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-bold transition-all"
                        placeholder="your@email.com"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 font-bold flex items-center justify-between group">
                        <span>{userData.email}</span>
                        <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                          <CheckCircleIcon className="w-4 h-4" />
                          Đã xác minh
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                      <PhoneIcon className="w-4 h-4 inline mr-2" />
                      Số điện thoại
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-bold transition-all"
                        placeholder="+84 xxx xxx xxx"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 font-bold">{userData.phone}</div>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                      <MapPinIcon className="w-4 h-4 inline mr-2" />
                      Địa chỉ
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.location}
                        onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-bold transition-all"
                        placeholder="Thành phố, Quốc gia"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 font-bold">{userData.location}</div>
                    )}
                  </div>

                  {/* Job */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                      <BriefcaseIcon className="w-4 h-4 inline mr-2" />
                      Công việc
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.job}
                        onChange={(e) => setEditData({ ...editData, job: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-bold transition-all"
                        placeholder="Vị trí công việc"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 font-bold">{userData.job}</div>
                    )}
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                      Giới thiệu
                      <span className="text-gray-400 normal-case ml-2">
                        ({editData.bio.length}/200)
                      </span>
                    </label>
                    {isEditing ? (
                      <textarea
                        value={editData.bio}
                        onChange={(e) => setEditData({ ...editData, bio: e.target.value.slice(0, 200) })}
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-bold resize-none transition-all"
                        placeholder="Viết vài dòng về bản thân..."
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50">{userData.bio}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="border-2 border-black p-6">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                  <BellIcon className="w-6 h-6 stroke-2" />
                  Tùy chọn
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 group hover:bg-gray-50 px-2 transition-all">
                    <div>
                      <div className="font-bold flex items-center gap-2">
                        <EnvelopeIcon className="w-4 h-4" />
                        Thông báo email
                      </div>
                      <div className="text-xs text-gray-500">Nhận email về cập nhật mục tiêu</div>
                    </div>
                    <label className="relative inline-block w-12 h-6 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={preferences.emailNotifications}
                        onChange={(e) => setPreferences({...preferences, emailNotifications: e.target.checked})}
                      />
                      <div className="w-full h-full bg-gray-300 peer-checked:bg-green-600 transition-all"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white transition-all peer-checked:translate-x-6 shadow-lg"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200 group hover:bg-gray-50 px-2 transition-all">
                    <div>
                      <div className="font-bold flex items-center gap-2">
                        <BellIcon className="w-4 h-4" />
                        Thông báo push
                      </div>
                      <div className="text-xs text-gray-500">Nhận thông báo trên trình duyệt</div>
                    </div>
                    <label className="relative inline-block w-12 h-6 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={preferences.pushNotifications}
                        onChange={(e) => setPreferences({...preferences, pushNotifications: e.target.checked})}
                      />
                      <div className="w-full h-full bg-gray-300 peer-checked:bg-green-600 transition-all"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white transition-all peer-checked:translate-x-6 shadow-lg"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 group hover:bg-gray-50 px-2 transition-all">
                    <div>
                      <div className="font-bold flex items-center gap-2">
                        <GlobeAltIcon className="w-4 h-4" />
                        Hiển thị profile công khai
                      </div>
                      <div className="text-xs text-gray-500">Cho phép người khác xem profile của bạn</div>
                    </div>
                    <label className="relative inline-block w-12 h-6 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={preferences.publicProfile}
                        onChange={(e) => setPreferences({...preferences, publicProfile: e.target.checked})}
                      />
                      <div className="w-full h-full bg-gray-300 peer-checked:bg-green-600 transition-all"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white transition-all peer-checked:translate-x-6 shadow-lg"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Links */}
              <div className="border-2 border-black p-6">
                <h3 className="text-sm font-black uppercase tracking-widest mb-4">Liên kết nhanh</h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-4 py-3 hover:bg-black hover:text-white transition-all font-bold text-sm flex items-center gap-2 group">
                    <GlobeAltIcon className="w-5 h-5 stroke-2 group-hover:scale-110 transition-transform" />
                    Website
                  </button>
                  <button className="w-full text-left px-4 py-3 hover:bg-black hover:text-white transition-all font-bold text-sm flex items-center gap-2 group">
                    <EnvelopeIcon className="w-5 h-5 stroke-2 group-hover:scale-110 transition-transform" />
                    Liên hệ hỗ trợ
                  </button>
                  <button className="w-full text-left px-4 py-3 hover:bg-blue-600 hover:text-white transition-all font-bold text-sm flex items-center gap-2 group">
                    <ArrowUpTrayIcon className="w-5 h-5 stroke-2 group-hover:scale-110 transition-transform" />
                    Export dữ liệu
                  </button>
                </div>
              </div>

              {/* Achievements */}
              <div className="border-2 border-black p-6">
                <h3 className="text-sm font-black uppercase tracking-widest mb-4">Thành tích gần đây</h3>
                <div className="space-y-3">
                  {achievements.slice(0, 3).map((achievement, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 p-2 hover:bg-gray-50 transition-all cursor-pointer group"
                    >
                      <div className={`w-10 h-10 ${achievement.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <TrophyIcon className="w-5 h-5 text-white stroke-2" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm truncate">{achievement.title}</div>
                        <div className="text-xs text-gray-500">{achievement.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-all font-bold uppercase text-xs tracking-wider">
                  Xem tất cả
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Change Password */}
            <div className="border-2 border-black p-6">
              <h2 className="text-2xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                <KeyIcon className="w-6 h-6 stroke-2" />
                Đổi mật khẩu
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                    Mật khẩu hiện tại *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.current ? "text" : "password"}
                      value={passwordData.current}
                      onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                      className="w-full pl-4 pr-12 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-bold transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword({...showPassword, current: !showPassword.current})}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 transition-all"
                    >
                      {showPassword.current ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                    Mật khẩu mới *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.new ? "text" : "password"}
                      value={passwordData.new}
                      onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                      className="w-full pl-4 pr-12 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-bold transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword({...showPassword, new: !showPassword.new})}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 transition-all"
                    >
                      {showPassword.new ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {passwordData.new && (
                    <div className="mt-3 space-y-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((level) => {
                          const strength = Object.values(passwordStrength).filter(Boolean).length;
                          return (
                            <div
                              key={level}
                              className={`h-1 flex-1 transition-all ${
                                strength >= level
                                  ? strength === 4 ? 'bg-green-600' : strength === 3 ? 'bg-yellow-500' : 'bg-red-600'
                                  : 'bg-gray-200'
                              }`}
                            />
                          );
                        })}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          {passwordStrength.length ? (
                            <CheckCircleIcon className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircleIcon className="w-4 h-4 text-gray-400" />
                          )}
                          <span className={passwordStrength.length ? 'text-green-600 font-bold' : 'text-gray-500'}>
                            Ít nhất 8 ký tự
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          {passwordStrength.uppercase ? (
                            <CheckCircleIcon className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircleIcon className="w-4 h-4 text-gray-400" />
                          )}
                          <span className={passwordStrength.uppercase ? 'text-green-600 font-bold' : 'text-gray-500'}>
                            Có chữ in hoa
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          {passwordStrength.lowercase ? (
                            <CheckCircleIcon className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircleIcon className="w-4 h-4 text-gray-400" />
                          )}
                          <span className={passwordStrength.lowercase ? 'text-green-600 font-bold' : 'text-gray-500'}>
                            Có chữ thường
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          {passwordStrength.number ? (
                            <CheckCircleIcon className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircleIcon className="w-4 h-4 text-gray-400" />
                          )}
                          <span className={passwordStrength.number ? 'text-green-600 font-bold' : 'text-gray-500'}>
                            Có số
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                    Xác nhận mật khẩu mới *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      value={passwordData.confirm}
                      onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                      className="w-full pl-4 pr-12 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-bold transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword({...showPassword, confirm: !showPassword.confirm})}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 transition-all"
                    >
                      {showPassword.confirm ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {passwordData.confirm && passwordData.new !== passwordData.confirm && (
                    <p className="mt-2 text-xs text-red-600 font-bold flex items-center gap-1">
                      <XCircleIcon className="w-4 h-4" />
                      Mật khẩu không khớp
                    </p>
                  )}
                </div>

                <button 
                  onClick={handlePasswordChange}
                  disabled={!passwordData.current || !passwordData.new || !passwordData.confirm || passwordData.new !== passwordData.confirm}
                  className="w-full px-6 py-3 bg-black text-white hover:bg-gray-800 transition-all font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cập nhật mật khẩu
                </button>
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className="border-2 border-black p-6">
              <h2 className="text-2xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                <ShieldCheckIcon className="w-6 h-6 stroke-2" />
                Xác thực 2 lớp
              </h2>

              <div className="flex items-center justify-between p-4 bg-gray-50 mb-4">
                <div>
                  <div className="font-bold mb-1">Trạng thái</div>
                  <div className="text-sm text-gray-500">Chưa kích hoạt</div>
                </div>
                <button className="px-6 py-2 bg-green-600 text-white hover:bg-green-700 transition-all font-bold uppercase tracking-wider text-sm">
                  Kích hoạt
                </button>
              </div>

              <p className="text-sm text-gray-600">
                Xác thực 2 lớp giúp bảo vệ tài khoản của bạn khỏi truy cập trái phép bằng cách yêu cầu mã xác minh khi đăng nhập.
              </p>
            </div>

            {/* Danger Zone */}
            <div className="border-2 border-red-600 p-6">
              <h2 className="text-2xl font-black uppercase tracking-tight mb-6 text-red-600">
                Vùng nguy hiểm
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-red-50">
                  <div>
                    <div className="font-bold text-red-600">Xóa tài khoản</div>
                    <div className="text-sm text-gray-600">Xóa vĩnh viễn tài khoản và tất cả dữ liệu</div>
                  </div>
                  <button className="px-6 py-2 bg-red-600 text-white hover:bg-red-700 transition-all font-bold uppercase tracking-wider text-sm">
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-8">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="border-2 border-black p-6 hover:bg-black hover:text-white transition-all group">
                    <div className="flex items-center justify-between mb-4">
                      <Icon className={`w-8 h-8 ${stat.color} group-hover:text-white stroke-2`} />
                    </div>
                    <div className="text-4xl font-black mb-2">
                      {stat.value}
                      {stat.unit && <span className="text-xl text-gray-400 group-hover:text-gray-300 ml-1">{stat.unit}</span>}
                    </div>
                    <div className="text-xs uppercase tracking-wider text-gray-500 group-hover:text-gray-300 font-bold">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Activity Chart */}
            <div className="border-2 border-black p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black uppercase tracking-tight">Hoạt động 30 ngày qua</h2>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-all font-bold text-xs uppercase">
                    Tuần
                  </button>
                  <button className="px-4 py-2 border-2 border-black bg-black text-white font-bold text-xs uppercase">
                    Tháng
                  </button>
                  <button className="px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-all font-bold text-xs uppercase">
                    Năm
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-10 gap-2">
                {Array.from({ length: 30 }).map((_, index) => {
                  const activity = Math.floor(Math.random() * 5);
                  const colors = ['bg-gray-100', 'bg-green-200', 'bg-green-400', 'bg-green-600', 'bg-green-800'];
                  return (
                    <div
                      key={index}
                      className={`aspect-square ${colors[activity]} border border-gray-200 hover:ring-2 hover:ring-black cursor-pointer transition-all hover:scale-110 group relative`}
                      title={`Ngày ${index + 1}`}
                    >
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs font-black text-white mix-blend-difference">{activity}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="text-xs text-gray-500">
                  <span className="font-bold">Tổng:</span> 87 ngày hoạt động
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-gray-500">Ít</span>
                  <div className="flex gap-1">
                    <div className="w-4 h-4 bg-gray-100 border border-gray-200"></div>
                    <div className="w-4 h-4 bg-green-200 border border-gray-200"></div>
                    <div className="w-4 h-4 bg-green-400 border border-gray-200"></div>
                    <div className="w-4 h-4 bg-green-600 border border-gray-200"></div>
                    <div className="w-4 h-4 bg-green-800 border border-gray-200"></div>
                  </div>
                  <span className="text-gray-500">Nhiều</span>
                </div>
              </div>
            </div>

            {/* All Achievements */}
            <div className="border-2 border-black p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black uppercase tracking-tight">Tất cả thành tích</h2>
                <div className="text-sm">
                  <span className="font-bold">{achievements.length}</span>
                  <span className="text-gray-500"> / 20 đạt được</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((achievement, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-4 p-4 border-2 border-black hover:bg-gray-50 transition-all group cursor-pointer hover:shadow-lg"
                  >
                    <div className={`w-16 h-16 ${achievement.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <TrophyIcon className="w-8 h-8 text-white stroke-2" />
                    </div>
                    <div className="flex-1">
                      <div className="font-black text-lg mb-1 uppercase">{achievement.title}</div>
                      <div className="text-sm text-gray-600 mb-2">{achievement.desc}</div>
                      <div className="text-xs uppercase tracking-wider text-gray-500 font-bold flex items-center gap-2">
                        <CalendarIcon className="w-3 h-3" />
                        {achievement.date}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-8 h-8 bg-green-600 text-white flex items-center justify-center font-black">
                        <CheckIcon className="w-5 h-5 stroke-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

import { useState } from 'react';
import {
  XMarkIcon,
  CalendarIcon,
  FlagIcon,
  SparklesIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Goal } from '../interfaces/Goal';
import { CreateGoalPayload, goalsApi } from '../lib/api/goalsApi';

interface CreateGoalProps {
  initialGoal?: Goal | null;
  onClose?: () => void;
  onSuccess?: () => void;
}

type CreateGoalFormData = CreateGoalPayload;

const CreateGoal = ({ initialGoal, onClose, onSuccess }: CreateGoalProps) => {
  const isEditMode = Boolean(initialGoal);
  const [formData, setFormData] = useState<CreateGoalFormData>({
    title: initialGoal?.title ?? '',
    description: initialGoal?.description ?? '',
    goal_type: initialGoal?.goal_type ?? 'short_term',
    priority: initialGoal?.priority ?? 'medium',
    status: initialGoal?.status ?? 'not_started',
    start_date: initialGoal?.start_date ?? new Date().toISOString().split('T')[0],
    target_date: initialGoal?.target_date ?? '',
    note: initialGoal?.note ?? '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const priorityOptions = [
    { value: 'low', label: 'Thấp', color: 'bg-green-100 text-green-700 border-green-300' },
    { value: 'medium', label: 'Trung bình', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
    { value: 'high', label: 'Cao', color: 'bg-red-100 text-red-700 border-red-300' },
    { value: 'critical', label: 'Rất cao', color: 'bg-black text-white border-black' },
  ];

  const goalTypeOptions = [
    { value: 'short_term', label: 'Ngắn hạn' },
    { value: 'mid_term', label: 'Trung hạn' },
    { value: 'long_term', label: 'Dài hạn' },
  ];

  const statusOptions = [
    { value: 'not_started', label: 'Chưa bắt đầu' },
    { value: 'in_progress', label: 'Đang thực hiện' },
    { value: 'paused', label: 'Tạm dừng' },
    { value: 'completed', label: 'Hoàn thành' },
    { value: 'cancelled', label: 'Đã hủy' },
  ];

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Vui lòng nhập tiêu đề';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Tiêu đề phải có ít nhất 3 ký tự';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Vui lòng nhập mô tả';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Mô tả phải có ít nhất 10 ký tự';
    }
    
    if (!formData.start_date) {
      newErrors.start_date = 'Vui lòng chọn ngày bắt đầu';
    }

    if (!formData.target_date) {
      newErrors.target_date = 'Vui lòng chọn ngày mục tiêu';
    } else {
      const selectedDate = new Date(formData.target_date);
      const startDate = new Date(formData.start_date);
      if (selectedDate < startDate) {
        newErrors.target_date = 'Ngày mục tiêu phải từ ngày bắt đầu trở đi';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (initialGoal) {
        await goalsApi.update(initialGoal.id, formData);
      } else {
        await goalsApi.create(formData);
      }
      
      setShowSuccess(true);
      
      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          goal_type: 'short_term',
          priority: 'medium',
          status: 'not_started',
          start_date: new Date().toISOString().split('T')[0],
          target_date: '',
          note: '',
        });
        setShowSuccess(false);
        
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }, 1500);
      
    } catch (error) {
      console.error('Loi khi tao muc tieu:', error);
      setErrors({ submit: initialGoal ? 'Khong cap nhat duoc muc tieu.' : 'Khong tao duoc muc tieu.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = <K extends keyof CreateGoalFormData>(field: K, value: CreateGoalFormData[K]) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircleIcon className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Thành công!</h3>
            <p className="text-gray-600">
              {isEditMode ? 'Mục tiêu đã được cập nhật thành công' : 'Mục tiêu đã được tạo thành công'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {isEditMode ? 'Cập nhật mục tiêu' : 'Tạo mục tiêu mới'}
                </h2>
                <p className="text-blue-100 text-sm">
                  {isEditMode ? 'Chỉnh lại thông tin mục tiêu hiện tại' : 'Bắt đầu hành trình của bạn'}
                </p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-white" />
              </button>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
              Tiêu đề mục tiêu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="VD: Học React trong 3 tháng"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 outline-none transition-all ${
                errors.title
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200 hover:border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fade-in">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              Mô tả chi tiết <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Mô tả chi tiết về mục tiêu của bạn..."
              rows={4}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 outline-none transition-all resize-none ${
                errors.description
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200 hover:border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fade-in">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.description}
              </p>
            )}
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <span>Hãy mô tả rõ ràng để dễ theo dõi tiến độ</span>
              <span>{formData.description.length} ký tự</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="goal_type" className="block text-sm font-semibold text-gray-700 mb-2">
                Loại mục tiêu
              </label>
              <select
                id="goal_type"
                value={formData.goal_type}
                onChange={(e) => handleChange('goal_type', e.target.value as CreateGoalFormData['goal_type'])}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer hover:border-gray-300"
                disabled={isSubmitting}
              >
                {goalTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value as CreateGoalFormData['status'])}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer hover:border-gray-300"
                disabled={isSubmitting}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date */}
            <div>
              <label htmlFor="start_date" className="block text-sm font-semibold text-gray-700 mb-2">
                Ngày bắt đầu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  id="start_date"
                  value={formData.start_date}
                  onChange={(e) => handleChange('start_date', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 outline-none transition-all ${
                    errors.start_date
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200 hover:border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.start_date && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fade-in">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.start_date}
                </p>
              )}
            </div>

            {/* Target Date */}
            <div>
              <label htmlFor="target_date" className="block text-sm font-semibold text-gray-700 mb-2">
                Ngày mục tiêu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  id="target_date"
                  value={formData.target_date}
                  onChange={(e) => handleChange('target_date', e.target.value)}
                  min={formData.start_date || undefined}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 outline-none transition-all ${
                    errors.target_date
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200 hover:border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.target_date && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fade-in">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.target_date}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-2">
              Độ ưu tiên
            </label>
            <div className="relative">
              <FlagIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value as CreateGoalFormData['priority'])}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer hover:border-gray-300"
                disabled={isSubmitting}
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-2">Độ ưu tiên đã chọn:</p>
            <div className="flex items-center gap-2">
              {priorityOptions.map((option) => (
                <span
                  key={option.value}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-all ${
                    formData.priority === option.value
                      ? option.color + ' scale-110'
                      : 'bg-gray-200 text-gray-400 border-gray-300 opacity-50'
                  }`}
                >
                  {option.label}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="note" className="block text-sm font-semibold text-gray-700 mb-2">
              Ghi chú chiến lược
            </label>
            <textarea
              id="note"
              value={formData.note}
              onChange={(e) => handleChange('note', e.target.value)}
              placeholder="Ghi thêm điều quan trọng, bối cảnh hoặc ghi chú cá nhân..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all resize-none hover:border-gray-300"
              disabled={isSubmitting}
            />
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 animate-fade-in">
              <p className="text-red-600 text-sm font-medium flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {errors.submit}
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{isEditMode ? 'Đang cập nhật...' : 'Đang tạo...'}</span>
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5" />
                  <span>{isEditMode ? 'Lưu thay đổi' : 'Tạo mục tiêu'}</span>
                </>
              )}
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGoal;

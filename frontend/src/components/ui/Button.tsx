import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-black text-white hover:bg-stone-800',
  secondary: 'border border-stone-300 bg-white text-stone-900 hover:border-stone-900',
  ghost: 'bg-transparent text-stone-700 hover:bg-stone-100',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

const Button = ({
  children,
  className = '',
  disabled,
  fullWidth = false,
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) => (
  <button
    type={type}
    disabled={disabled}
    className={[
      'inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all',
      'disabled:cursor-not-allowed disabled:opacity-50',
      fullWidth ? 'w-full' : '',
      variantClasses[variant],
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...props}
  >
    {children}
  </button>
);

export default Button;

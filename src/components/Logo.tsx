import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'dark' | 'light' | 'badge';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'dark',
  size = 'md',
  showTagline = true
}) => {
  const isLight = variant === 'light'; // Used on dark backgrounds (Footer)

  const imgSizes = {
    sm: 'h-9',
    md: 'h-11 md:h-12',
    lg: 'h-16 md:h-20'
  };

  const logoImg = (
    <img
      src="/logo.png"
      alt="Trendy Bazaar"
      className={`w-auto object-contain ${imgSizes[size]}`}
    />
  );

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`} id="brand-logo">
      {isLight ? (
        <div className="bg-white rounded-xl p-1.5 sm:p-2 shadow-sm">{logoImg}</div>
      ) : (
        logoImg
      )}

      {showTagline && (
        <span
          className={`text-[9px] uppercase tracking-[0.2em] font-semibold ${
            isLight ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          Pakistan
        </span>
      )}
    </div>
  );
};

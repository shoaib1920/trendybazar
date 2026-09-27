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
  const isDark = variant === 'dark'; // Dark text on light bg
  const isLight = variant === 'light'; // Light text on dark bg

  const bagSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg md:text-xl',
    lg: 'text-2xl md:text-3xl'
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`} id="brand-logo">
      {/* Shopping Bag Mark with Cut-Out "B" in Gold on Black/White */}
      <div className={`relative flex items-center justify-center shrink-0 ${bagSizes[size]}`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Bag Handle */}
          <path
            d="M17 18V12C17 8.13401 20.134 5 24 5C27.866 5 31 8.13401 31 12V18"
            stroke={isLight ? '#F2B705' : '#1A1A1A'}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Shopping Bag Body */}
          <rect
            x="7"
            y="14"
            width="34"
            height="30"
            rx="6"
            fill="#F2B705"
          />
          {/* Inner Accent Line */}
          <path
            d="M7 21C11 23 15 20 20 22C25 24 30 21 41 21"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />
          {/* Cut-Out Stylized Letter "B" */}
          <path
            d="M19 22H24.5C26.433 22 28 23.3431 28 25C28 26.6569 26.433 28 24.5 28H19V22Z"
            fill={isLight ? '#1A1A1A' : '#111111'}
          />
          <path
            d="M19 28H25C27.2091 28 29 29.567 29 31.5C29 33.433 27.2091 35 25 35H19V28Z"
            fill={isLight ? '#1A1A1A' : '#111111'}
          />
          <rect
            x="19"
            y="22"
            width="3.5"
            height="13"
            fill={isLight ? '#1A1A1A' : '#111111'}
          />
          {/* Gold cutouts inside B loops */}
          <circle cx="23" cy="25" r="1.2" fill="#F2B705" />
          <circle cx="23.5" cy="31.5" r="1.5" fill="#F2B705" />
        </svg>
      </div>

      {/* Brand Wordmark */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1">
          <span
            className={`font-heading font-black tracking-tight ${textSizes[size]} ${
              isLight ? 'text-white' : 'text-[#1A1A1A]'
            }`}
          >
            TRENDY
          </span>
          <span
            className={`font-heading font-black tracking-tight ${textSizes[size]} text-[#F2B705]`}
          >
            BAZAR
          </span>
        </div>
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
    </div>
  );
};

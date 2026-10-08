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
    sm: 'h-11',
    md: 'h-9 sm:h-12',
    lg: 'h-20 md:h-24'
  };

  const nameSizes = {
    sm: 'text-[13px]',
    md: 'text-[13px] sm:text-[15px]',
    lg: 'text-lg md:text-xl'
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
        <div className="flex flex-col leading-none">
          <span
            className={`font-black uppercase tracking-[0.14em] whitespace-nowrap ${nameSizes[size]} ${
              isLight ? 'text-white' : 'text-[#141414]'
            }`}
          >
            Trendy Bazaar
          </span>
          <span
            className={`mt-1 text-[9px] uppercase tracking-[0.3em] font-semibold ${
              isLight ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            Pakistan
          </span>
        </div>
      )}
    </div>
  );
};

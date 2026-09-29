import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
}

export const VagabondLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10 min-w-[2.5rem] min-h-[2.5rem]',
    md: 'w-12 h-12 min-w-[3rem] min-h-[3rem] sm:w-14 sm:h-14 sm:min-w-[3.5rem] sm:min-h-[3.5rem]',
    lg: 'w-16 h-16 min-w-[4rem] min-h-[4rem]',
    xl: 'w-24 h-24 min-w-[6rem] min-h-[6rem]',
    custom: '',
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div 
      className={`relative inline-flex items-center justify-center flex-shrink-0 aspect-square overflow-hidden rounded-xl select-none ${selectedSize} ${className}`}
      style={{ aspectRatio: '1 / 1' }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 500 500"
        className="w-full h-full object-contain block"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Vagabond Tours Logo"
        role="img"
      >
        {/* Dark Charcoal / Black badge background with rounded corners */}
        <rect width="500" height="500" rx="44" fill="#121214" />

        {/* Outer thin white frame border */}
        <rect
          x="22"
          y="22"
          width="456"
          height="456"
          rx="30"
          fill="none"
          stroke="#ffffff"
          strokeWidth="8"
        />

        {/* Inner white box containing the V */}
        <rect
          x="160"
          y="68"
          width="180"
          height="180"
          rx="4"
          fill="none"
          stroke="#ffffff"
          strokeWidth="10"
        />

        {/* Stylized sharp bold white chevron V */}
        <polygon
          points="175,85 215,85 250,188 285,85 325,85 268,235 232,235"
          fill="#ffffff"
        />

        {/* Brand Name Text: VAGABOND */}
        <text
          x="250"
          y="332"
          fontFamily="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="54"
          fill="#ffffff"
          textAnchor="middle"
          letterSpacing="4"
        >
          VAGABOND
        </text>

        {/* Brand Name Text: TOURS */}
        <text
          x="250"
          y="394"
          fontFamily="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="54"
          fill="#ffffff"
          textAnchor="middle"
          letterSpacing="4"
        >
          TOURS
        </text>

        {/* Brand Tagline: CREATE HAPPINESS */}
        <text
          x="250"
          y="442"
          fontFamily="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="700"
          fontSize="19"
          fill="#e4e4e7"
          textAnchor="middle"
          letterSpacing="7"
        >
          CREATE HAPPINESS
        </text>
      </svg>
    </div>
  );
};

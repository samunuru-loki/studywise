import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  color,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
    lg: 'px-3 py-1.5 text-sm font-medium',
  };

  const customStyle = color ? {
    backgroundColor: `${color}15`,
    color: color,
    borderColor: `${color}40`,
  } : {};

  return (
    <span
      style={customStyle}
      className={`inline-flex items-center gap-1.5 rounded-full border transition-colors ${
        !color ? 'bg-slate-100 text-slate-700 border-slate-200' : ''
      } ${sizeClasses[size]} ${className}`}
    >
      {color && (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;

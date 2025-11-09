import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div 
      className={`rounded-lg border border-gray-800 shadow-sm bg-black ${className}`}
      style={{
        boxShadow: '0 0 10px rgba(226, 0, 116, 0.3), 0 0 20px rgba(226, 0, 116, 0.2)'
      }}
    >
      {children}
    </div>
  );
};


import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function Card({ title, children, className }: CardProps) {
  return (
    <div className={`bg-white shadow-lg rounded-lg p-6 ${className}`}>
      <h2 className="text-xl font-bold mb-4 border-b pb-2">{title}</h2>
      <div>{children}</div>
    </div>
  );
}

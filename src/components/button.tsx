import React from 'react';

export type buttonProps = {
  children: React.ReactNode;
};

export default function button({ children }: buttonProps) {
  return (
    <div className="bg-white text-black px-4 py-2 rounded-md shadow-md hover:bg-opacity-90 active:bg-opacity-50 w-1/2 text-center">
      {children}
    </div>
  );
}

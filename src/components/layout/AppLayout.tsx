import React from 'react';
import { TopAppBar } from './TopAppBar';
import { BottomNavBar } from './BottomNavBar';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col pt-16 pb-24 md:pb-0">
      <TopAppBar />
      <main className="flex-grow w-full max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop py-8 flex flex-col gap-10">
        {children}
      </main>
      <BottomNavBar />
    </div>
  );
};

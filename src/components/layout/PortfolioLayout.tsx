import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useHasSidebar } from '@/hooks/use-mobile';
import { portfolioData } from '@/data/portfolio';
import NavigationSidebar from './NavigationSidebar';
import NavigationHeader from './NavigationHeader';

const PortfolioLayout: React.FC = () => {
  const hasSidebar = useHasSidebar();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300">
      {/* Mobile Header */}
      {!hasSidebar && <NavigationHeader />}

      <div className="lg:flex">
        {/* Sidebar Navigation - Desktop */}
        {hasSidebar && <NavigationSidebar />}

        {/* Main Content */}
        <main className={`flex-1 ${!hasSidebar ? 'pt-20' : 'lg:ml-96'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PortfolioLayout;
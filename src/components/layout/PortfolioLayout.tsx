import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useHasSidebar } from '@/hooks/use-mobile';
import { portfolioData } from '@/data/portfolio';
import NavigationSidebar from './NavigationSidebar';
import NavigationHeader from './NavigationHeader';
import SkipNavigation from '@/components/ui/SkipNavigation';

const PortfolioLayout: React.FC = () => {
  const hasSidebar = useHasSidebar();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300">
      {/* Skip Navigation - Always first for keyboard users */}
      <SkipNavigation mainContentId="main-content" />
      
      {/* Mobile Header */}
      {!hasSidebar && <NavigationHeader />}

      <div className="lg:flex">
        {/* Sidebar Navigation - Desktop */}
        {hasSidebar && <NavigationSidebar />}

        {/* Main Content */}
        <main 
          id="main-content"
          className={`flex-1 ${!hasSidebar ? 'pt-20' : 'lg:ml-96'}`}
          tabIndex={-1}
          aria-label="Main content"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PortfolioLayout;
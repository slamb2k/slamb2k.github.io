import React from 'react';

interface SkipNavigationProps {
  /** The ID of the main content area to skip to */
  mainContentId?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * SkipNavigation component provides keyboard users with the ability to skip
 * repetitive navigation content and go directly to the main content.
 *
 * The component is visually hidden by default but becomes visible when focused,
 * ensuring it doesn't interfere with the visual design while maintaining accessibility.
 *
 * @param mainContentId - The ID of the main content element (defaults to 'main-content')
 * @param className - Additional CSS classes to apply
 */
const SkipNavigation: React.FC<SkipNavigationProps> = ({
  mainContentId = 'main-content',
  className = '',
}) => {
  const handleSkipToMain = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const mainElement = document.getElementById(mainContentId);
    if (mainElement) {
      // Set focus to the main content element
      mainElement.focus();
      // Scroll to the main content if needed
      mainElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={`skip-navigation ${className}`}>
      <a
        href={`#${mainContentId}`}
        onClick={handleSkipToMain}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-teal-300 focus:text-slate-900 focus:rounded-lg focus:font-medium focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-300/50 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200"
        tabIndex={0}
      >
        Skip to main content
      </a>
    </div>
  );
};

export default SkipNavigation;

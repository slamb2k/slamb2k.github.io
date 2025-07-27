/**
 * Type definitions for portfolio components
 */

import { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  id: string;
  label: string;
}

export interface SocialLinkWithIcon {
  icon: LucideIcon;
  href: string;
  label: string;
}

export interface AnimatedLetterProps {
  letter: string;
  itemId: string;
  letterIndex: number;
  shouldAnimate: boolean;
}

export interface SectionProps {
  className?: string;
}
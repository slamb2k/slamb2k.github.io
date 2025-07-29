import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LazySection from './LazySection';

// Mock the performance utils
const mockUseIntersectionObserver = vi.fn();
vi.mock('@/utils/performance', () => ({
  useIntersectionObserver: mockUseIntersectionObserver,
}));

describe('LazySection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when visible', () => {
    mockUseIntersectionObserver.mockReturnValue(true);

    render(
      <LazySection>
        <div>Test content</div>
      </LazySection>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders fallback when not visible', () => {
    mockUseIntersectionObserver.mockReturnValue(false);

    render(
      <LazySection fallback={<div>Loading...</div>}>
        <div>Test content</div>
      </LazySection>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Test content')).not.toBeInTheDocument();
  });

  it('renders default fallback when not visible and no custom fallback', () => {
    mockUseIntersectionObserver.mockReturnValue(false);

    const { container } = render(
      <LazySection>
        <div>Test content</div>
      </LazySection>
    );

    // Should render default min-height div
    const fallback = container.querySelector('.min-h-96');
    expect(fallback).toBeInTheDocument();
    expect(screen.queryByText('Test content')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    mockUseIntersectionObserver.mockReturnValue(true);

    const { container } = render(
      <LazySection className="custom-class">
        <div>Test content</div>
      </LazySection>
    );

    const section = container.firstChild;
    expect(section).toHaveClass('custom-class');
  });

  it('maintains visibility state with once=true (default)', () => {
    // Start not visible
    mockUseIntersectionObserver.mockReturnValue(false);

    const { rerender } = render(
      <LazySection>
        <div>Test content</div>
      </LazySection>
    );

    expect(screen.queryByText('Test content')).not.toBeInTheDocument();

    // Become visible
    mockUseIntersectionObserver.mockReturnValue(true);
    rerender(
      <LazySection>
        <div>Test content</div>
      </LazySection>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();

    // Become not visible again - should still render due to once=true
    mockUseIntersectionObserver.mockReturnValue(false);
    rerender(
      <LazySection>
        <div>Test content</div>
      </LazySection>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('toggles visibility with once=false', () => {
    // Start not visible
    mockUseIntersectionObserver.mockReturnValue(false);

    const { rerender } = render(
      <LazySection once={false}>
        <div>Test content</div>
      </LazySection>
    );

    expect(screen.queryByText('Test content')).not.toBeInTheDocument();

    // Become visible
    mockUseIntersectionObserver.mockReturnValue(true);
    rerender(
      <LazySection once={false}>
        <div>Test content</div>
      </LazySection>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();

    // Become not visible again - should hide due to once=false
    mockUseIntersectionObserver.mockReturnValue(false);
    rerender(
      <LazySection once={false}>
        <div>Test content</div>
      </LazySection>
    );

    expect(screen.queryByText('Test content')).not.toBeInTheDocument();
  });

  it('calls useIntersectionObserver with correct options', () => {
    mockUseIntersectionObserver.mockReturnValue(true);

    render(
      <LazySection rootMargin="200px" threshold={0.5}>
        <div>Test content</div>
      </LazySection>
    );

    expect(mockUseIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Object), // ref
      {
        rootMargin: '200px',
        threshold: 0.5,
      }
    );
  });

  it('uses default intersection observer options', () => {
    mockUseIntersectionObserver.mockReturnValue(true);

    render(
      <LazySection>
        <div>Test content</div>
      </LazySection>
    );

    expect(mockUseIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Object), // ref
      {
        rootMargin: '100px',
        threshold: 0.1,
      }
    );
  });
});

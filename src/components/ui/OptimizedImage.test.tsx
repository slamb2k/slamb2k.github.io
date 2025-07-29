import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import OptimizedImage from './OptimizedImage';

// Mock the performance utils
vi.mock('@/utils/performance', () => ({
  useIntersectionObserver: vi.fn(() => true), // Always visible by default
}));

describe('OptimizedImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders image with basic props', () => {
    render(<OptimizedImage src="/test-image.jpg" alt="Test image" width={400} height={300} />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'Test image');
    expect(img).toHaveAttribute('width', '400');
    expect(img).toHaveAttribute('height', '300');
  });

  it('generates srcset for responsive images', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    );

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('srcset');
    expect(img).toHaveAttribute('sizes', '(max-width: 768px) 100vw, 50vw');
  });

  it('shows placeholder when loading', () => {
    render(
      <OptimizedImage src="/test-image.jpg" alt="Test image" placeholder="/placeholder.jpg" />
    );

    // Should show loading text initially
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('applies priority loading for critical images', () => {
    render(
      <OptimizedImage src="/test-image.jpg" alt="Test image" priority={true} loading="eager" />
    );

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('loading', 'eager');
    expect(img).toHaveAttribute('src', '/test-image.jpg');
  });

  it('handles image load error', async () => {
    render(<OptimizedImage src="/invalid-image.jpg" alt="Test image" />);

    const img = screen.getByRole('img');

    // Simulate image error
    const errorEvent = new Event('error');
    img.dispatchEvent(errorEvent);

    await waitFor(() => {
      expect(screen.getByText('Failed to load')).toBeInTheDocument();
    });
  });

  it('applies custom className', () => {
    render(<OptimizedImage src="/test-image.jpg" alt="Test image" className="custom-class" />);

    const img = screen.getByRole('img');
    expect(img).toHaveClass('custom-class');
  });

  it('sets aspect ratio from width and height', () => {
    render(<OptimizedImage src="/test-image.jpg" alt="Test image" width={800} height={600} />);

    const img = screen.getByRole('img');
    expect(img).toHaveStyle({ aspectRatio: '800/600' });
  });

  it('calls onLoad callback when image loads', async () => {
    const onLoad = vi.fn();

    render(
      <OptimizedImage src="/test-image.jpg" alt="Test image" onLoad={onLoad} priority={true} />
    );

    const img = screen.getByRole('img');

    // Simulate image load
    const loadEvent = new Event('load');
    img.dispatchEvent(loadEvent);

    await waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });
  });

  it('calls onError callback when image fails to load', async () => {
    const onError = vi.fn();

    render(
      <OptimizedImage src="/invalid-image.jpg" alt="Test image" onError={onError} priority={true} />
    );

    const img = screen.getByRole('img');

    // Simulate image error
    const errorEvent = new Event('error');
    img.dispatchEvent(errorEvent);

    await waitFor(() => {
      expect(onError).toHaveBeenCalledTimes(1);
    });
  });

  it('handles placeholder images correctly', () => {
    render(<OptimizedImage src="/api/placeholder/600/400" alt="Placeholder image" />);

    const img = screen.getByRole('img');
    // Should not generate srcset for placeholder URLs
    const srcset = img.getAttribute('srcset');
    expect(srcset).toBe('/api/placeholder/600/400');
  });
});

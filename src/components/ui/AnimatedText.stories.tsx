import type { Meta, StoryObj } from '@storybook/react';
import { AnimatedText } from './AnimatedText';

const meta = {
  title: 'UI/AnimatedText',
  component: AnimatedText,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A text component with smooth fade-in animation using Framer Motion. Perfect for progressive content disclosure.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes to apply to the text',
    },
    delay: {
      control: { type: 'number', min: 0, max: 2, step: 0.1 },
      description: 'Animation delay in seconds',
    },
  },
} satisfies Meta<typeof AnimatedText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'This text will fade in smoothly',
  },
};

export const WithDelay: Story = {
  args: {
    children: 'This text appears after a delay',
    delay: 0.5,
  },
};

export const LongDelay: Story = {
  args: {
    children: 'This text has a longer delay',
    delay: 1.0,
  },
};

export const Heading: Story = {
  args: {
    as: 'h1',
    className: 'text-4xl font-bold text-center',
    children: 'Animated Heading',
  },
};

export const Paragraph: Story = {
  args: {
    as: 'p',
    className: 'text-lg text-gray-600 max-w-md text-center',
    children:
      'This is an animated paragraph with some longer text to demonstrate how the component works with different content lengths.',
  },
};

export const SmallText: Story = {
  args: {
    className: 'text-sm text-gray-500',
    children: 'Small animated text',
    delay: 0.2,
  },
};

export const ColoredText: Story = {
  args: {
    className: 'text-2xl font-semibold text-blue-600',
    children: 'Colored Animated Text',
    delay: 0.3,
  },
};

export const MultipleLines: Story = {
  args: {
    className: 'text-center max-w-lg',
    children: (
      <>
        This is a multi-line animated text component.
        <br />
        <br />
        It can handle multiple paragraphs and line breaks while maintaining smooth animation.
      </>
    ),
    delay: 0.4,
  },
};

export const WithStrongEmphasis: Story = {
  args: {
    className: 'text-lg',
    children: (
      <>
        This text has <strong>bold</strong> and <em>italic</em> formatting while still being
        animated.
      </>
    ),
    delay: 0.1,
  },
};

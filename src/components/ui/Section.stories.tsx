import type { Meta, StoryObj } from '@storybook/react';
import { Section } from './Section';
import { Card, CardContent } from './Card';

const meta = {
  title: 'UI/Section',
  component: Section,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A layout component that provides consistent spacing and structure for page sections.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes to apply to the section',
    },
    id: {
      control: { type: 'text' },
      description: 'The section ID for navigation and accessibility',
    },
  },
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div>
        <h2 className="text-3xl font-bold mb-6">Section Title</h2>
        <p className="text-gray-600 mb-8">
          This is a sample section with some content. The Section component provides consistent
          padding and spacing throughout the application.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Feature 1</h3>
              <p className="text-sm text-gray-600">Description of the first feature.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Feature 2</h3>
              <p className="text-sm text-gray-600">Description of the second feature.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    ),
  },
};

export const WithId: Story = {
  args: {
    id: 'about',
    children: (
      <div>
        <h2 className="text-3xl font-bold mb-6">About Section</h2>
        <p className="text-gray-600">
          This section has an ID that can be used for navigation and deep linking.
        </p>
      </div>
    ),
  },
};

export const CustomStyling: Story = {
  args: {
    className: 'bg-gray-50 border-l-4 border-blue-500',
    children: (
      <div>
        <h2 className="text-3xl font-bold mb-6 text-blue-900">Custom Styled Section</h2>
        <p className="text-gray-700">
          This section demonstrates custom styling with background color and border.
        </p>
      </div>
    ),
  },
};

export const DarkTheme: Story = {
  args: {
    className: 'bg-gray-900 text-white',
    children: (
      <div>
        <h2 className="text-3xl font-bold mb-6">Dark Theme Section</h2>
        <p className="text-gray-300 mb-8">
          This section demonstrates how the component works with dark themes.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 text-white">Item {i}</h3>
                <p className="text-sm text-gray-400">Dark themed card content.</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    ),
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const MinimalContent: Story = {
  args: {
    children: (
      <div className="text-center">
        <h2 className="text-2xl font-bold">Simple Section</h2>
        <p className="text-gray-600 mt-2">Minimal content example.</p>
      </div>
    ),
  },
};

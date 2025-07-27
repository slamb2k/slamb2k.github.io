import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';
import { Button } from './Button';
import { Badge } from 'lucide-react';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible card component with header, content, and footer sections for displaying content in a structured way.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes to apply to the card',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description goes here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is the main content of the card.</p>
        </CardContent>
      </>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    children: (
      <>
        <CardHeader>
          <CardTitle>Project Card</CardTitle>
          <CardDescription>A sample project with actions</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            This project demonstrates the card component with a footer containing action buttons.
          </p>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button size="sm">View Project</Button>
          <Button variant="outline" size="sm">
            Learn More
          </Button>
        </CardFooter>
      </>
    ),
  },
};

export const ProjectCard: Story = {
  args: {
    children: (
      <>
        <CardHeader>
          <CardTitle>E-Commerce Platform</CardTitle>
          <CardDescription>Full-stack web application</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Built a complete e-commerce solution with React, Node.js, and MongoDB. Features include
            user authentication, product catalog, shopping cart, and payment processing.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">React</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs">
              Node.js
            </span>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-xs">
              MongoDB
            </span>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-xs">
              Stripe
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button size="sm">View Demo</Button>
          <Button variant="outline" size="sm">
            GitHub
          </Button>
        </CardFooter>
      </>
    ),
  },
};

export const ExperienceCard: Story = {
  args: {
    children: (
      <>
        <CardHeader>
          <CardTitle>Senior Software Engineer</CardTitle>
          <CardDescription>Tech Company Inc. • 2021 - Present</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Led development of microservices architecture serving 1M+ users</li>
            <li>Mentored junior developers and conducted code reviews</li>
            <li>Improved application performance by 40% through optimization</li>
            <li>Implemented CI/CD pipelines reducing deployment time by 60%</li>
          </ul>
        </CardContent>
      </>
    ),
  },
};

export const MinimalCard: Story = {
  args: {
    children: (
      <CardContent>
        <p>A simple card with just content, no header or footer.</p>
      </CardContent>
    ),
  },
};

export const HeaderOnly: Story = {
  args: {
    children: (
      <CardHeader>
        <CardTitle>Header Only Card</CardTitle>
        <CardDescription>This card only has a header section.</CardDescription>
      </CardHeader>
    ),
  },
};

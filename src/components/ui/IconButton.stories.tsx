import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { IconButton } from './IconButton';
import {
  Heart,
  Star,
  Bookmark,
  Share,
  Download,
  Settings,
  Plus,
  Minus,
  Edit,
  Trash2,
  Mail,
  Phone,
  Github,
  Linkedin,
  ExternalLink,
} from 'lucide-react';

const meta = {
  title: 'UI/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A specialized button component designed for icon-only interactions with proper accessibility support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost'],
      description: 'The visual style variant of the button',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'default', 'lg'],
      description: 'The size of the button',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the button is disabled',
    },
    'aria-label': {
      control: { type: 'text' },
      description: 'Accessible label for screen readers (required)',
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <Heart className="w-4 h-4" />,
    'aria-label': 'Like this item',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: <Trash2 className="w-4 h-4" />,
    'aria-label': 'Delete item',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: <Bookmark className="w-4 h-4" />,
    'aria-label': 'Bookmark this page',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: <Share className="w-4 h-4" />,
    'aria-label': 'Share content',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: <Settings className="w-4 h-4" />,
    'aria-label': 'Open settings',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: <Plus className="w-3 h-3" />,
    'aria-label': 'Add new item',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: <Download className="w-5 h-5" />,
    'aria-label': 'Download file',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: <Edit className="w-4 h-4" />,
    'aria-label': 'Edit (disabled)',
  },
};

export const SocialIcons: Story = {
  render: () => (
    <div className="flex gap-2">
      <IconButton aria-label="Visit GitHub profile">
        <Github className="w-4 h-4" />
      </IconButton>
      <IconButton aria-label="Visit LinkedIn profile">
        <Linkedin className="w-4 h-4" />
      </IconButton>
      <IconButton aria-label="Send email">
        <Mail className="w-4 h-4" />
      </IconButton>
      <IconButton aria-label="Call phone">
        <Phone className="w-4 h-4" />
      </IconButton>
    </div>
  ),
};

export const ActionGroup: Story = {
  render: () => (
    <div className="flex gap-1 border rounded-lg p-1">
      <IconButton variant="ghost" size="sm" aria-label="Add item">
        <Plus className="w-3 h-3" />
      </IconButton>
      <IconButton variant="ghost" size="sm" aria-label="Remove item">
        <Minus className="w-3 h-3" />
      </IconButton>
      <IconButton variant="ghost" size="sm" aria-label="Edit item">
        <Edit className="w-3 h-3" />
      </IconButton>
      <IconButton variant="ghost" size="sm" aria-label="Delete item">
        <Trash2 className="w-3 h-3" />
      </IconButton>
    </div>
  ),
};

export const InteractiveStates: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <span className="text-sm">Default:</span>
        <IconButton aria-label="Star item">
          <Star className="w-4 h-4" />
        </IconButton>
      </div>
      <div className="flex gap-2 items-center">
        <span className="text-sm">Favorited:</span>
        <IconButton aria-label="Unfavorite item" className="text-yellow-500">
          <Star className="w-4 h-4 fill-current" />
        </IconButton>
      </div>
      <div className="flex gap-2 items-center">
        <span className="text-sm">Disabled:</span>
        <IconButton disabled aria-label="Star item (disabled)">
          <Star className="w-4 h-4" />
        </IconButton>
      </div>
    </div>
  ),
};

export const WithExternalLink: Story = {
  args: {
    asChild: true,
    children: (
      <a
        href="https://example.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open external link"
      >
        <ExternalLink className="w-4 h-4" />
      </a>
    ),
  },
};

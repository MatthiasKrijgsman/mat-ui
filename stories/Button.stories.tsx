import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../src";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  args: {
    children: "Click me",
    variant: "primary",
    size: "md",
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = { args: {
  children: "Button",
  variant: "white"
} };

export const Primary: Story = { args: { children: "Primary", variant: "primary" } };
export const Secondary: Story = { args: { children: "Secondary", variant: "secondary" } };
export const Tertiary: Story = { args: { children: "Tertiary", variant: "tertiary" } };
export const White: Story = { args: { children: "White", variant: "white" } };
export const Black: Story = { args: { children: "Black", variant: "black" } };
export const Transparent: Story = { args: { children: "Transparent", variant: "transparent" } };

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 flex-wrap">
        <Button { ...args } variant="primary">Primary</Button>
        <Button { ...args } variant="secondary">Secondary</Button>
        <Button { ...args } variant="tertiary">Tertiary</Button>
        <Button { ...args } variant="white">White</Button>
        <Button { ...args } variant="black">Black</Button>
        <Button { ...args } variant="transparent">Transparent</Button>
      </div>
      <div className="flex gap-3 flex-wrap items-center">
        <Button { ...args } size="sm" variant="primary">SM</Button>
        <Button { ...args } size="md" variant="primary">MD</Button>
        <Button { ...args } size="lg" variant="primary">LG</Button>
      </div>
    </div>
  )
};

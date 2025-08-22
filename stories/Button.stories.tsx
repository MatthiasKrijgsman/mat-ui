import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../src/components/Button.tsx";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  args: {
    children: "Click me",
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = { args: { children: "Test!" } };
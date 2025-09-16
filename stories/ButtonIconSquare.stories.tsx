import type { Meta, StoryObj } from "@storybook/react-vite";
import { ButtonIconSquare } from "../src";
import { IconPlus } from "@tabler/icons-react";

const meta: Meta<typeof ButtonIconSquare> = {
  title: "Components/ButtonIconSquare",
  component: ButtonIconSquare,
  args: {
    variant: "white",
    size: "md",
    Icon: IconPlus,
  },
};
export default meta;

type Story = StoryObj<typeof ButtonIconSquare>;

export const Default: Story = {};
export const Primary: Story = { args: { variant: "primary" } };
export const Secondary: Story = { args: { variant: "secondary" } };
export const Tertiary: Story = { args: { variant: "tertiary" } };
export const White: Story = { args: { variant: "white" } };
export const Black: Story = { args: { variant: "black" } };
export const Transparent: Story = { args: { variant: "transparent" } };

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 flex-wrap items-center">
        <ButtonIconSquare { ...args } variant="primary" />
        <ButtonIconSquare { ...args } variant="secondary" />
        <ButtonIconSquare { ...args } variant="tertiary" />
        <ButtonIconSquare { ...args } variant="white" />
        <ButtonIconSquare { ...args } variant="black" />
        <ButtonIconSquare { ...args } variant="transparent" />
      </div>
      <div className="flex gap-3 flex-wrap items-center">
        <ButtonIconSquare { ...args } size="sm" />
        <ButtonIconSquare { ...args } size="md" />
        <ButtonIconSquare { ...args } size="lg" />
      </div>
    </div>
  )
};


import type { Meta, StoryObj } from "@storybook/react-vite";
import { ButtonIconRound } from "../src";
import { IconPlus } from "@tabler/icons-react";

const meta: Meta<typeof ButtonIconRound> = {
  title: "Components/ButtonIconRound",
  component: ButtonIconRound,
  args: {
    variant: "white",
    size: "md",
    Icon: IconPlus,
  },
};
export default meta;

type Story = StoryObj<typeof ButtonIconRound>;

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
        <ButtonIconRound { ...args } variant="primary" />
        <ButtonIconRound { ...args } variant="secondary" />
        <ButtonIconRound { ...args } variant="tertiary" />
        <ButtonIconRound { ...args } variant="white" />
        <ButtonIconRound { ...args } variant="black" />
        <ButtonIconRound { ...args } variant="transparent" />
      </div>
      <div className="flex gap-3 flex-wrap items-center">
        <ButtonIconRound { ...args } size="sm" />
        <ButtonIconRound { ...args } size="md" />
        <ButtonIconRound { ...args } size="lg" />
      </div>
    </div>
  )
};


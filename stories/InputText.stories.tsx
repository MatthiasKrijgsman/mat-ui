import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "../src";

const meta: Meta<typeof Input> = {
  title: "Components/InputText",
  component: Input,
  args: {
    placeholder: "Enter text",
    label: "Label",
    description: "Description"
  }
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = { args: {
    placeholder: "Enter text",
    label: "Label",
    description: "Description"
  } };

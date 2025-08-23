import type { Meta, StoryObj } from "@storybook/react-vite";
import { InputText } from "../src";

const meta: Meta<typeof InputText> = {
  title: "Components/InputText",
  component: InputText,
  args: {
    placeholder: "Enter text",
    label: "Label",
    description: "Description"
  }
};
export default meta;

type Story = StoryObj<typeof InputText>;

export const Default: Story = { args: {
    placeholder: "Enter text",
    label: "Label",
    description: "Description"
  } };

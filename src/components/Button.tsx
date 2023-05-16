import { ButtonContainer, ButtonVariant } from "./Button.style";

interface ButtonProps {
  variant?: ButtonVariant;
}

const Button = ({ variant = "primary" }: ButtonProps) => {
  return <ButtonContainer variant={variant}>button</ButtonContainer>;
};

export { Button };

import classNames from "classnames";
import styles from "./styles.module.scss";
import { type ButtonHTMLAttributes } from "react";

type ButtonColor = "primary" | "secondary";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  disabled?: boolean;
  color?: ButtonColor;
}

const IconButton = ({
  onClick,
  icon,
  disabled,
  color = "primary",
  id,
  ...rest
}: IconButtonProps) => {
  return (
    <button
      className={classNames(styles.button, styles[`color-${color}`])}
      onClick={onClick}
      disabled={disabled}
      id={id}
      {...rest}
    >
      <img src={icon} />
    </button>
  );
};

export default IconButton;

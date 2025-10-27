import classNames from "classnames";
import styles from "./styles.module.scss";
import { ButtonHTMLAttributes } from "react";
import { ButtonColor, ButtonSize } from "./types";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  disabled?: boolean;
  color?: ButtonColor;
  size?: ButtonSize;
}

const IconButton = ({
  onClick,
  icon,
  disabled,
  color = "primary",
  size = "medium",
  id,
  ...rest
}: IconButtonProps) => {
  return (
    <button
      className={classNames(
        styles.button,
        styles[`color-${color}`],
        styles[`size-${size}`]
      )}
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

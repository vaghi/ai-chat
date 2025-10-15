import styles from "./styles.module.scss";
import { type ButtonHTMLAttributes } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  disabled?: boolean;
}

const IconButton = ({
  onClick,
  icon,
  disabled,
  id,
  ...rest
}: IconButtonProps) => {
  return (
    <button
      className={styles.button}
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

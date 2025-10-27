import IconButton from "../icon-button/icon-button";
import ConfigIcon from "../../assets/icons/config.svg";
import styles from "./styles.module.scss";
import classNames from "classnames";
import ThemeToggle from "../theme-toggle/theme-toggle";

interface ConfigMenuProps {
  isOpen: boolean;
  onChangeOpenMenu: (isOpen: boolean) => void;
  showContent: boolean;
}

export const ConfigMenu = ({
  isOpen,
  onChangeOpenMenu,
  showContent,
}: ConfigMenuProps) => {
  return (
    <div
      id="config-menu-container"
      className={classNames(styles.configMenuContainer, {
        [styles.menuOpen]: isOpen,
      })}
    >
      <div
        className={classNames(styles.content, {
          [styles.showContent]: showContent,
        })}
      >
        <ThemeToggle />
      </div>
      <IconButton
        icon={ConfigIcon}
        color="secondary"
        onClick={() => onChangeOpenMenu(!isOpen)}
      />
    </div>
  );
};

import IconButton from "../icon-button/icon-button";
import ConfigIcon from "@assets/icons/config.svg";
import styles from "./styles.module.scss";
import classNames from "classnames";
import ThemeToggle from "../theme-toggle";

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
      data-testid="config-menu-main" // Added data-testid to the main container
      className={classNames(styles.configMenuContainer, {
        [styles.menuOpen]: isOpen,
      })}
    >
      <div
        data-testid="config-menu-content" // Added data-testid to the content area
        className={classNames(styles.content, {
          [styles.showContent]: showContent,
        })}
      >
        <ThemeToggle />
      </div>
      <IconButton
        data-testid="config-menu-toggle-button" // Added data-testid to the button
        icon={ConfigIcon}
        color="secondary"
        onClick={() => onChangeOpenMenu(!isOpen)}
      />
    </div>
  );
};

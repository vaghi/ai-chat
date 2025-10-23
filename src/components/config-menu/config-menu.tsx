import IconButton from "../icon-button/icon-button";
import ConfigIcon from "../../assets/icons/config.svg";
import styles from "./styles.module.scss";

interface ConfigMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const ConfigMenu = ({ isOpen, setIsOpen }: ConfigMenuProps) => {
  return (
    <div id="config-menu-container" className={styles.configMenuContainer}>
      <IconButton
        icon={ConfigIcon}
        color="secondary"
        onClick={() => setIsOpen(!isOpen)}
      />
    </div>
  );
};

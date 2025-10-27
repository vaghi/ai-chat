import { useEffect, useState } from "react";
import { ConfigMenu } from "./config-menu";

const ConfigMenuContainer = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {}, [isMenuOpen]);

  const handleMenuChange = (open: boolean) => {
    if (open) {
      setIsMenuOpen(open);
      setTimeout(() => setShowContent(true), 600);
    } else {
      setShowContent(false);
      setTimeout(() => setIsMenuOpen(false), 500);
    }
  };

  return (
    <ConfigMenu
      isOpen={isMenuOpen}
      onChangeOpenMenu={handleMenuChange}
      showContent={showContent}
    />
  );
};

export default ConfigMenuContainer;

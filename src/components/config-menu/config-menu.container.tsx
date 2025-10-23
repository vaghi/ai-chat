import { useState } from "react";
import { ConfigMenu } from "./config-menu";

const ConfigMenuContainer = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  //TODO: Remove with functionality is developed and working
  return null;

  return <ConfigMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />;
};

export default ConfigMenuContainer;

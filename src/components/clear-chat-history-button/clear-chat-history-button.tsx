import IconButton from "../icon-button";
import TrashIcon from "@assets/icons/trash.svg";

interface ClearChatHistoryButtonProps {
  onClearChatHistory: () => void;
}

export const ClearChatHistoryButton = ({
  onClearChatHistory,
}: ClearChatHistoryButtonProps) => {
  return (
    <IconButton
      data-testid="config-menu-toggle-button" // Added data-testid to the button
      icon={TrashIcon}
      color="primary"
      size={"small"}
      onClick={onClearChatHistory}
    />
  );
};

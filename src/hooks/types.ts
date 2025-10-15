export enum MessageSender {
  USER = "user",
  AGENT = "agent",
}

export interface ChatHistoryItem {
  id: string;
  value: string;
  source: MessageSender;
}

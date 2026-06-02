import type { MessagingProvider } from "./MessagingProvider";

export class WebChatMessagingProvider implements MessagingProvider {
  async sendMessage(): Promise<void> {
    return Promise.resolve();
  }
}

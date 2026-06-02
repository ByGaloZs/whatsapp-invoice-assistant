import type { MessagingProvider } from "./MessagingProvider";

export class WhatsAppCloudMessagingProvider implements MessagingProvider {
  async sendMessage(): Promise<void> {
    // Future implementation: send messages using Meta WhatsApp Cloud API.
    throw new Error("WhatsAppCloudMessagingProvider is not implemented in the demo.");
  }
}

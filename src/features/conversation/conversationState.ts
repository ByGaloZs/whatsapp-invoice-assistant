import type { ChatMessage, ConversationState } from "./conversationTypes";

export function createMessage(message: Omit<ChatMessage, "id">): ChatMessage {
  return {
    id: crypto.randomUUID(),
    ...message,
  };
}

export function createInitialConversationState(): ConversationState {
  return {
    step: "WAITING_FOR_TICKET_IMAGE",
    messages: [
      createMessage({
        sender: "bot",
        text: "Hola, puedo ayudarte a solicitar tu factura. Por favor envíame una foto clara de tu ticket.",
      }),
    ],
    ticketData: null,
    fiscalData: {},
    invoiceRequest: null,
  };
}

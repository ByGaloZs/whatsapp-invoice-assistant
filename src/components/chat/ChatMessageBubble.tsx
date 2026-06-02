import type { ChatMessage } from "@/features/conversation/conversationTypes";
import { TicketExtractionSummary } from "./TicketExtractionSummary";

type ChatMessageBubbleProps = {
  message: ChatMessage;
};

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isUser = message.sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm shadow-lg ${
          isUser
            ? "rounded-tr-sm bg-whatsapp-bubble text-white"
            : "rounded-tl-sm bg-whatsapp-inbound text-slate-100"
        }`}
      >
        {message.imageUrl ? (
          <img
            src={message.imageUrl}
            alt="Uploaded ticket preview"
            className="mb-3 max-h-48 rounded-xl object-cover"
          />
        ) : null}
        <p className="whitespace-pre-line leading-6">{message.text}</p>
        {message.ticketData ? <TicketExtractionSummary ticketData={message.ticketData} /> : null}
      </div>
    </div>
  );
}

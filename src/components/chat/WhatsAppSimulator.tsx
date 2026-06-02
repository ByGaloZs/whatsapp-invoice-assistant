"use client";

import { useEffect, useRef, useState } from "react";
import {
  addInvoiceRequestCreated,
  addTicketExtractionResult,
  addTicketUploadMessages,
  handleTextMessage,
  isCompleteFiscalData,
} from "@/features/conversation/conversationFlow";
import { createInitialConversationState } from "@/features/conversation/conversationState";
import type { ConversationApiResponse } from "@/features/conversation/conversationTypes";
import type { ExtractedTicketData } from "@/features/ticket-extraction/ticketExtractionTypes";
import { ChatInput } from "./ChatInput";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { TicketImageUploader } from "./TicketImageUploader";

export function WhatsAppSimulator() {
  const [conversation, setConversation] = useState(createInitialConversationState);
  const [isWorking, setIsWorking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [conversation.messages]);

  async function handleTicketUpload(file: File, previewUrl: string) {
    setIsWorking(true);
    setConversation((current) => addTicketUploadMessages(current, previewUrl));

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/ticket-extraction", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("No pude leer el ticket. Intenta con otra imagen.");
      }

      const data = (await response.json()) as { ticketData: ExtractedTicketData };
      setConversation((current) => addTicketExtractionResult(current, data.ticketData));
    } catch (error) {
      const message = error instanceof Error ? error.message : "No pude leer el ticket.";
      setConversation((current) => ({
        ...current,
        step: "WAITING_FOR_TICKET_IMAGE",
        messages: [
          ...current.messages,
          {
            id: crypto.randomUUID(),
            sender: "bot",
            text: message,
          },
        ],
      }));
    } finally {
      setIsWorking(false);
    }
  }

  async function handleSend(text: string) {
    const nextConversation = handleTextMessage(conversation, text);
    setConversation(nextConversation);

    if (nextConversation.step === "READY_FOR_MANUAL_REVIEW") {
      await createDemoInvoiceRequest(nextConversation);
    }
  }

  async function createDemoInvoiceRequest(nextConversation: typeof conversation) {
    if (!nextConversation.ticketData || !isCompleteFiscalData(nextConversation.fiscalData)) {
      return;
    }

    setIsWorking(true);

    try {
      const response = await fetch("/api/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticket: nextConversation.ticketData,
          fiscalData: nextConversation.fiscalData,
        }),
      });

      if (!response.ok) {
        throw new Error("No pude crear la solicitud demo.");
      }

      const data = (await response.json()) as ConversationApiResponse;
      setConversation((current) => addInvoiceRequestCreated(current, data.invoiceRequest));
    } catch (error) {
      const message = error instanceof Error ? error.message : "No pude crear la solicitud demo.";
      setConversation((current) => ({
        ...current,
        messages: [
          ...current.messages,
          { id: crypto.randomUUID(), sender: "bot", text: message },
        ],
      }));
    } finally {
      setIsWorking(false);
    }
  }

  const canUploadTicket = conversation.step === "WAITING_FOR_TICKET_IMAGE" && !isWorking;

  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-whatsapp-panel shadow-2xl shadow-black/40">
      <div className="flex items-center justify-between border-b border-white/10 bg-[#1f2c33] px-5 py-4">
        <div>
          <p className="font-semibold">Factura Bot</p>
          <p className="text-xs text-slate-400">Demo local · {isWorking ? "procesando" : "en línea"}</p>
        </div>
        <TicketImageUploader disabled={!canUploadTicket} onUpload={handleTicketUpload} />
      </div>

      <div
        ref={scrollRef}
        className="h-[560px] space-y-3 overflow-y-auto bg-whatsapp-bg bg-[linear-gradient(135deg,rgba(255,255,255,0.03)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.03)_50%,rgba(255,255,255,0.03)_75%,transparent_75%,transparent)] bg-[length:48px_48px] p-4"
      >
        {conversation.messages.map((message) => (
          <ChatMessageBubble key={message.id} message={message} />
        ))}
      </div>

      <ChatInput
        disabled={isWorking || conversation.step === "WAITING_FOR_TICKET_IMAGE" || conversation.step === "INVOICE_REQUEST_CREATED"}
        placeholder={conversation.step === "WAITING_FOR_TICKET_CONFIRMATION" ? "Responde sí o no" : "Escribe tu respuesta"}
        onSend={handleSend}
      />
    </div>
  );
}

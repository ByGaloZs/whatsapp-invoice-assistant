import type { FiscalData, InvoiceRequest } from "@/features/invoice-request/invoiceRequestTypes";
import type { ExtractedTicketData } from "@/features/ticket-extraction/ticketExtractionTypes";
import { validateFiscalZipCode, validateRequiredText, validateRfc } from "@/utils/validators";
import { createMessage } from "./conversationState";
import type { ConversationState } from "./conversationTypes";

export function addTicketUploadMessages(
  state: ConversationState,
  imageUrl: string,
): ConversationState {
  return {
    ...state,
    step: "EXTRACTING_TICKET_DATA",
    messages: [
      ...state.messages,
      createMessage({ sender: "user", text: "Subí una foto de mi ticket.", imageUrl }),
      createMessage({ sender: "bot", text: "Estoy leyendo tu ticket..." }),
    ],
  };
}

export function addTicketExtractionResult(
  state: ConversationState,
  ticketData: ExtractedTicketData,
): ConversationState {
  return {
    ...state,
    step: "WAITING_FOR_TICKET_CONFIRMATION",
    ticketData,
    messages: [
      ...state.messages,
      createMessage({
        sender: "bot",
        text: "Detecté estos datos. ¿Son correctos? Responde sí para continuar o no para intentar con otra foto.",
        ticketData,
      }),
    ],
  };
}

export function handleTextMessage(state: ConversationState, text: string): ConversationState {
  const trimmedText = text.trim();
  const userMessage = createMessage({ sender: "user", text: trimmedText });

  switch (state.step) {
    case "WAITING_FOR_TICKET_CONFIRMATION":
      if (/^(si|sí|s|yes)$/i.test(trimmedText)) {
        return {
          ...state,
          step: "COLLECTING_RFC",
          messages: [
            ...state.messages,
            userMessage,
            createMessage({ sender: "bot", text: "Perfecto. ¿Cuál es tu RFC?" }),
          ],
        };
      }

      return {
        ...state,
        step: "WAITING_FOR_TICKET_IMAGE",
        ticketData: null,
        messages: [
          ...state.messages,
          userMessage,
          createMessage({ sender: "bot", text: "Entendido. Por favor envía otra foto clara del ticket." }),
        ],
      };

    case "COLLECTING_RFC":
      if (!validateRfc(trimmedText)) {
        return addValidationMessage(state, userMessage, "El RFC no parece válido. Inténtalo de nuevo.");
      }

      return collectFiscalField(state, userMessage, { rfc: trimmedText.toUpperCase() }, "COLLECTING_BUSINESS_NAME", "Gracias. ¿Cuál es la razón social?");

    case "COLLECTING_BUSINESS_NAME":
      if (!validateRequiredText(trimmedText)) {
        return addValidationMessage(state, userMessage, "La razón social es requerida.");
      }

      return collectFiscalField(state, userMessage, { businessName: trimmedText }, "COLLECTING_FISCAL_ZIP_CODE", "¿Cuál es tu código postal fiscal?");

    case "COLLECTING_FISCAL_ZIP_CODE":
      if (!validateFiscalZipCode(trimmedText)) {
        return addValidationMessage(state, userMessage, "El código postal fiscal debe tener 5 dígitos.");
      }

      return collectFiscalField(state, userMessage, { fiscalZipCode: trimmedText }, "COLLECTING_TAX_REGIME", "¿Cuál es tu régimen fiscal?");

    case "COLLECTING_TAX_REGIME":
      if (!validateRequiredText(trimmedText)) {
        return addValidationMessage(state, userMessage, "El régimen fiscal es requerido.");
      }

      return collectFiscalField(state, userMessage, { taxRegime: trimmedText }, "COLLECTING_CFDI_USE", "Por último, ¿cuál es el uso de CFDI?");

    case "COLLECTING_CFDI_USE":
      if (!validateRequiredText(trimmedText)) {
        return addValidationMessage(state, userMessage, "El uso de CFDI es requerido.");
      }

      return {
        ...state,
        step: "READY_FOR_MANUAL_REVIEW",
        fiscalData: { ...state.fiscalData, cfdiUse: trimmedText },
        messages: [
          ...state.messages,
          userMessage,
          createMessage({ sender: "bot", text: "Gracias. Crearé tu solicitud de factura para revisión manual." }),
        ],
      };

    default:
      return {
        ...state,
        messages: [
          ...state.messages,
          userMessage,
          createMessage({ sender: "bot", text: "Para comenzar, envíame una foto clara de tu ticket." }),
        ],
      };
  }
}

export function addInvoiceRequestCreated(
  state: ConversationState,
  invoiceRequest: InvoiceRequest,
): ConversationState {
  return {
    ...state,
    step: "INVOICE_REQUEST_CREATED",
    invoiceRequest,
    messages: [
      ...state.messages,
      createMessage({
        sender: "bot",
        text: `Tu solicitud de factura fue creada correctamente y pasará a revisión manual. Folio demo: ${invoiceRequest.id}`,
      }),
    ],
  };
}

export function isCompleteFiscalData(data: Partial<FiscalData>): data is FiscalData {
  return Boolean(data.rfc && data.businessName && data.fiscalZipCode && data.taxRegime && data.cfdiUse);
}

function collectFiscalField(
  state: ConversationState,
  userMessage: ReturnType<typeof createMessage>,
  fiscalData: Partial<FiscalData>,
  nextStep: ConversationState["step"],
  botText: string,
): ConversationState {
  return {
    ...state,
    step: nextStep,
    fiscalData: { ...state.fiscalData, ...fiscalData },
    messages: [...state.messages, userMessage, createMessage({ sender: "bot", text: botText })],
  };
}

function addValidationMessage(
  state: ConversationState,
  userMessage: ReturnType<typeof createMessage>,
  botText: string,
): ConversationState {
  return {
    ...state,
    messages: [...state.messages, userMessage, createMessage({ sender: "bot", text: botText })],
  };
}

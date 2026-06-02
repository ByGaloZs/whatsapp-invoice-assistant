export type ExtractedTicketData = {
  ticketNumber: string | null;
  saleDate: string | null;
  totalAmount: number | null;
  stationName: string | null;
  paymentMethod: string | null;
  confidence: number;
  rawNotes: string[];
};

import type { ExtractedTicketData } from "@/features/ticket-extraction/ticketExtractionTypes";
import { formatCurrency, formatNullable } from "@/utils/formatters";

type TicketExtractionSummaryProps = {
  ticketData: ExtractedTicketData;
};

export function TicketExtractionSummary({ ticketData }: TicketExtractionSummaryProps) {
  return (
    <div className="mt-3 rounded-2xl border border-white/10 bg-black/15 p-3 text-sm text-slate-100">
      <dl className="grid gap-2">
        <SummaryRow label="Folio" value={formatNullable(ticketData.ticketNumber)} />
        <SummaryRow label="Fecha" value={formatNullable(ticketData.saleDate)} />
        <SummaryRow label="Total" value={formatCurrency(ticketData.totalAmount)} />
        <SummaryRow label="Estación" value={formatNullable(ticketData.stationName)} />
        <SummaryRow label="Pago" value={formatNullable(ticketData.paymentMethod)} />
        <SummaryRow label="Confianza" value={`${Math.round(ticketData.confidence * 100)}%`} />
      </dl>
      {ticketData.rawNotes.length > 0 ? (
        <p className="mt-3 text-xs text-slate-300">{ticketData.rawNotes.join(" ")}</p>
      ) : null}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-400">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

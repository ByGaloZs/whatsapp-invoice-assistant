import { WhatsAppSimulator } from "@/components/chat/WhatsAppSimulator";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#12312c,_#071015_45%,_#05080a)] px-4 py-6 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-center">
        <div className="max-w-xl space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-whatsapp-green">
            Demo assistant
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            WhatsApp-style invoice requests without real integrations yet.
          </h1>
          <p className="text-lg leading-8 text-slate-300">
            Upload a ticket photo, review mocked or OpenAI Vision extracted data,
            enter fiscal information, and create a demo invoice request ready for manual review.
          </p>
        </div>
        <WhatsAppSimulator />
      </section>
    </main>
  );
}

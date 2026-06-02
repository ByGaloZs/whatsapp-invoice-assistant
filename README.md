# WhatsApp Invoice Assistant Demo

Demo project for a WhatsApp-style invoice request assistant built with Next.js, React, TypeScript, Tailwind CSS, and the OpenAI API.

The demo shows this local flow:

1. User starts a conversation in a web WhatsApp simulator.
2. User uploads a ticket photo.
3. System extracts ticket data with OpenAI Vision, or returns mocked data when `OPENAI_API_KEY` is not configured.
4. Bot shows extracted ticket data for confirmation.
5. Bot asks for fiscal data step by step.
6. System creates a demo invoice request for manual review.

## Current Demo Scope

Implemented:

- Next.js App Router application.
- WhatsApp-style web simulator UI.
- Ticket image upload and preview.
- Isolated ticket extraction service with OpenAI API support.
- Mocked extraction fallback when no API key is present.
- Deterministic conversation flow.
- Demo invoice request creation.
- Provider interfaces for messaging, invoicing, and storage.
- Stub providers for future real integrations.
- Basic RFC, fiscal ZIP code, and required text validators.

## Intentionally Not Implemented Yet

- Real WhatsApp or Meta Cloud API integration.
- Real database persistence.
- Real CFDI generation.
- Real Facturama or Facturapi integration.
- Real admin dashboard.
- Production-grade ticket validation.
- Authentication, authorization, or multi-user sessions.

## Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Environment Variables

Copy `.env.example` to `.env.local` if you want to use OpenAI Vision extraction:

```env
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
```

If `OPENAI_API_KEY` is missing, the app returns mocked ticket data so the demo still runs locally.

## Useful Commands

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
```

## Project Structure

```text
src/
  app/
    api/
      conversation/
      ticket-extraction/
  components/chat/
  features/
    conversation/
    invoice-request/
    ticket-extraction/
  lib/
    adapters/
      invoicing/
      messaging/
      storage/
    openai/
  types/
  utils/
```

## Future Migration Path

```text
Web simulator -> Meta WhatsApp Cloud API
In-memory state -> PostgreSQL / Supabase
Demo invoice provider -> Facturama / Facturapi
Manual review placeholder -> Admin review dashboard
Mocked ticket validation -> ATIO / ControlGAS export, API, or manual review
```

The code keeps these seams explicit through provider interfaces and feature-level services, so each demo dependency can be replaced without rewriting the UI or conversation flow.

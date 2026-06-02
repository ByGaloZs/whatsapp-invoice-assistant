"use client";

import { FormEvent, useState } from "react";

type ChatInputProps = {
  disabled?: boolean;
  placeholder: string;
  onSend: (text: string) => void;
};

export function ChatInput({ disabled = false, placeholder, onSend }: ChatInputProps) {
  const [value, setValue] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!value.trim() || disabled) {
      return;
    }

    onSend(value);
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 border-t border-white/10 bg-whatsapp-panel p-3">
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="min-w-0 flex-1 rounded-full bg-[#2a3942] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="rounded-full bg-whatsapp-green px-5 py-3 text-sm font-semibold text-[#04251f] transition hover:bg-[#16c79a] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Enviar
      </button>
    </form>
  );
}

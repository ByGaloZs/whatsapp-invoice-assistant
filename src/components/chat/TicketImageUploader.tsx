"use client";

import type { ChangeEvent } from "react";

type TicketImageUploaderProps = {
  disabled?: boolean;
  onUpload: (file: File, previewUrl: string) => void;
};

export function TicketImageUploader({ disabled = false, onUpload }: TicketImageUploaderProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    onUpload(file, URL.createObjectURL(file));
    event.target.value = "";
  }

  return (
    <label className={`cursor-pointer rounded-full border border-white/10 px-4 py-2 text-sm font-medium transition ${disabled ? "cursor-not-allowed opacity-50" : "hover:bg-white/10"}`}>
      Subir ticket
      <input
        type="file"
        accept="image/*"
        disabled={disabled}
        onChange={handleChange}
        className="sr-only"
      />
    </label>
  );
}

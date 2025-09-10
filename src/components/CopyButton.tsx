"use client";

type Props = {
  text: string;
  className?: string;
  label?: string;
};

export function CopyButton({ text, className, label = "Copy Text" }: Props) {
  async function handleClick() {
    try {
      await navigator.clipboard.writeText(text);
      // Optional: basic feedback
      // eslint-disable-next-line no-alert
      alert("Copied to clipboard");
    } catch {
      // eslint-disable-next-line no-alert
      alert("Copy failed");
    }
  }

  return (
    <button onClick={handleClick} className={className ?? "px-3 py-1.5 rounded-md text-sm border"}>
      {label}
    </button>
  );
}



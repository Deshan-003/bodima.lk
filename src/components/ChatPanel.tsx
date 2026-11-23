import { useState } from "react";
import { Send, X } from "lucide-react";

type Message = { from: "owner" | "me"; text: string };

/** Simple mock chat with the property owner */
export default function ChatPanel({
  open,
  onClose,
  ownerName,
}: {
  open: boolean;
  onClose: () => void;
  ownerName: string;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "owner",
      text: "Hi! Thanks for your interest in the boarding place. How can I help?",
    },
  ]);
  const [draft, setDraft] = useState("");

  if (!open) return null;

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { from: "me", text }]);
    setDraft("");
    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: "owner",
          text: "Thanks for your message! I'll get back to you shortly.",
        },
      ]);
    }, 700);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4"
      onClick={onClose}
    >
      <div
        className="flex h-[520px] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-bar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-primary-100 px-5 py-4">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-700 text-[16px] font-extrabold text-white">
            {ownerName.slice(0, 1)}
          </span>
          <div className="flex-1">
            <p className="text-[16px] font-extrabold text-night">{ownerName}</p>
            <p className="flex items-center gap-1.5 text-[12px] font-semibold text-[#1F7A3D]">
              <span className="h-2 w-2 rounded-full bg-[#2EAA55]" />
              Online now
            </p>
          </div>
          <button
            type="button"
            aria-label="Close chat"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg text-night/50 transition hover:bg-lav hover:text-night"
          >
            <X size={20} strokeWidth={2.4} />
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto bg-page px-5 py-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
            >
              <p
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[14px] font-medium leading-relaxed ${
                  m.from === "me"
                    ? "rounded-br-sm bg-primary-700 text-white"
                    : "rounded-bl-sm bg-white text-night shadow-card"
                }`}
              >
                {m.text}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 border-t border-primary-100 p-4">
          <input
            aria-label="Message"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type your message..."
            className="h-11 flex-1 rounded-xl border border-primary-100 px-4 text-[14px] font-medium text-night placeholder:text-night/35 focus:border-primary-600 focus:outline-none"
          />
          <button
            type="button"
            aria-label="Send message"
            onClick={send}
            className="grid h-11 w-11 place-items-center rounded-xl bg-primary-700 text-white transition hover:bg-primary-800"
          >
            <Send size={19} strokeWidth={2.3} />
          </button>
        </div>
      </div>
    </div>
  );
}

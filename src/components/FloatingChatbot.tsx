import { useState } from "react";
import { Bot, Send, X } from "lucide-react";

type BotMessage = { from: "bot" | "me"; text: string };

const SUGGESTIONS = [
  "How do I contact an owner?",
  "How do I write a review?",
  "Where are my chats?",
  "How do filters work?",
];

function replyTo(text: string): string {
  const q = text.toLowerCase();
  if (q.includes("contact") || q.includes("chat")) {
    return "Open any listing and tap “Chat with Owner” — or call the owner using the mobile number shown there.";
  }
  if (q.includes("review")) {
    return "Sign in as a seeker, open a listing, and scroll to Reviews to rate it and write your experience.";
  }
  if (q.includes("chat history") || q.includes("previous") || q.includes("my chats")) {
    return "Click your account icon in the header and choose “My Chats” to reopen previous conversations.";
  }
  if (q.includes("filter") || q.includes("district") || q.includes("town") || q.includes("price")) {
    return "Use the Filters panel on the left: pick a district, then a town, set your price range, and apply.";
  }
  if (q.includes("sign") || q.includes("login") || q.includes("account")) {
    return "Use the Login or Sign Up buttons in the header. Choose “I'm a Seeker” to browse and chat with owners.";
  }
  return "I can help with listings, filters, owner chats, and reviews. Try one of the suggested questions below.";
}

/** Floating help assistant on the seeker browsing pages */
export default function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<BotMessage[]>([
    {
      from: "bot",
      text: "Hi! I'm the Bodima assistant. Need help finding a boarding place?",
    },
  ]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value) return;
    setMessages((prev) => [...prev, { from: "me", text: value }]);
    setDraft("");
    window.setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", text: replyTo(value) }]);
    }, 500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[430px] w-[350px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl bg-white shadow-bar">
          <div className="flex items-center gap-3 bg-primary-700 px-4 py-3.5 text-white">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15">
              <Bot size={20} strokeWidth={2.3} />
            </span>
            <div className="flex-1">
              <p className="text-[15px] font-extrabold">Bodima Assistant</p>
              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-white/75">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Here to help
              </p>
            </div>
            <button
              type="button"
              aria-label="Close assistant"
              onClick={() => setOpen(false)}
              className="grid h-8 w-8 place-items-center rounded-lg text-white/80 transition hover:bg-white/15 hover:text-white"
            >
              <X size={18} strokeWidth={2.4} />
            </button>
          </div>

          <div className="flex-1 space-y-2.5 overflow-y-auto bg-page px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
              >
                <p
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] font-medium leading-relaxed ${
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

          <div className="border-t border-primary-100 px-3 py-2.5">
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full bg-lav px-2.5 py-1 text-[11px] font-bold text-primary-700 transition hover:bg-primary-100"
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <input
                aria-label="Assistant message"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send(draft)}
                placeholder="Ask me anything..."
                className="h-10 flex-1 rounded-xl border border-primary-100 px-3 text-[13px] font-medium text-night placeholder:text-night/35 focus:border-primary-600 focus:outline-none"
              />
              <button
                type="button"
                aria-label="Send assistant message"
                onClick={() => send(draft)}
                className="grid h-10 w-10 place-items-center rounded-xl bg-primary-700 text-white transition hover:bg-primary-800"
              >
                <Send size={17} strokeWidth={2.3} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        aria-label={open ? "Close chatbot" : "Open chatbot"}
        onClick={() => setOpen(!open)}
        className="grid h-14 w-14 place-items-center rounded-full bg-primary-700 text-white shadow-bar transition hover:scale-105 hover:bg-primary-800"
      >
        {open ? <X size={24} strokeWidth={2.4} /> : <Bot size={26} strokeWidth={2.2} />}
      </button>
    </div>
  );
}

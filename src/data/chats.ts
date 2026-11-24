export type ChatMessage = {
  from: "owner" | "me";
  text: string;
  at: number;
};

export type ChatThread = {
  listingId: number;
  listingTitle: string;
  ownerName: string;
  messages: ChatMessage[];
  updatedAt: number;
};

const STORAGE_KEY = "bodima.chats.v1";

function readAll(): Record<string, ChatThread> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, ChatThread>) : {};
  } catch {
    return {};
  }
}

export function getThread(listingId: number): ChatThread | undefined {
  return readAll()[String(listingId)];
}

export function saveThread(thread: ChatThread): void {
  if (!Number.isFinite(thread.listingId) || !thread.listingTitle) return;
  try {
    const all = readAll();
    all[String(thread.listingId)] = thread;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // storage unavailable — the panel still works in memory
  }
}

/** Newest conversations first, for the account's "My Chats" page */
export function listThreads(): ChatThread[] {
  return Object.values(readAll())
    .filter(
      (t) =>
        Number.isFinite(t.listingId) &&
        !!t.listingTitle &&
        t.messages?.length > 0,
    )
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

import { ChevronRight, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { listThreads } from "../data/chats";
import { useAuth } from "../context/AuthContext";

/** Account page listing saved conversations with property owners */
export default function ChatsPage() {
  const { user } = useAuth();
  const threads = listThreads();

  return (
    <>
      <Header />
      <main className="min-h-[70vh] bg-page pb-16">
        <div className="mx-auto max-w-[800px] px-8 py-10">
          <h1 className="text-[32px] font-extrabold tracking-tight text-night">
            My Chats
          </h1>
          <p className="mt-2 text-[15px] font-medium text-night/60">
            Pick up where you left off with property owners.
          </p>

          {!user ? (
            <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow-card">
              <p className="text-[17px] font-bold text-night">
                Sign in to see your chats
              </p>
              <Link
                to="/login"
                className="mt-5 inline-block rounded-full bg-accent px-8 py-3 text-[15px] font-bold text-night"
              >
                Sign In
              </Link>
            </div>
          ) : threads.length === 0 ? (
            <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow-card">
              <p className="text-[17px] font-bold text-night">No chats yet</p>
              <p className="mt-2 text-[15px] font-medium text-night/60">
                Chat with an owner from any listing and it will appear here.
              </p>
              <Link
                to="/browse"
                className="mt-5 inline-block rounded-full bg-accent px-8 py-3 text-[15px] font-bold text-night"
              >
                Browse Places
              </Link>
            </div>
          ) : (
            <div className="mt-8 space-y-3">
              {threads.map((thread) => {
                const last = thread.messages[thread.messages.length - 1];
                return (
                  <Link
                    key={thread.listingId}
                    to={`/browse/${thread.listingId}?chat=1`}
                    className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-bar"
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary-700 text-[18px] font-extrabold text-white">
                      {thread.ownerName.slice(0, 1).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-[16px] font-extrabold text-night">
                          {thread.ownerName}
                        </p>
                        <span className="shrink-0 text-[12px] font-semibold text-night/45">
                          {new Date(thread.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-[13px] font-semibold text-primary-700">
                        {thread.listingTitle}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 truncate text-[14px] font-medium text-night/60">
                        <MessageCircle size={14} strokeWidth={2.3} className="shrink-0" />
                        {last?.text}
                      </p>
                    </div>
                    <ChevronRight size={19} strokeWidth={2.5} className="shrink-0 text-night/30" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

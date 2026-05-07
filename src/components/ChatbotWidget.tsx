import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send, Loader2, Bot, User, Leaf, Cat, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Message {
  role: "user" | "bot";
  text: string;
  results?: any[];
  resultType?: string;
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const QUICK_PROMPTS = [
  "Tell me about Bengal Tiger",
  "Endangered species in India",
  "What is Neem tree used for?",
  "Western Ghats ecosystem",
  "Plants in Himalayas",
];

// Simple markdown-bold renderer
const renderText = (text: string) => {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
  );
};

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "🌿 Namaste! I'm **BioDex AI** — your India Biodiversity assistant. Ask me about any animal, plant, or ecosystem found in India!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [messages, open]);

  const sendMessage = async (query: string) => {
    if (!query.trim() || loading) return;
    const userMsg: Message = { role: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      const botMsg: Message = {
        role: "bot",
        text: data.message || "I couldn't find information on that.",
        results: data.data || [],
        resultType: data.type,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Unable to reach the server. Make sure the backend is running on port 5000." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (item: any, type: string) => {
    if (type === "plants") navigate(`/plants/${item._id}`);
    else if (type === "species") navigate(`/animals/${item._id}`);
    setOpen(false);
  };

  const clearChat = () => {
    setMessages([{
      role: "bot",
      text: "🌿 Chat cleared! Ask me about any animal, plant, or ecosystem in India.",
    }]);
  };

  return (
    <>
      {/* ── Floating Button ── */}
      <button
        id="chatbot-toggle-btn"
        onClick={() => setOpen((o) => !o)}
        className={`fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          open
            ? "bg-destructive hover:bg-destructive/90 rotate-90 scale-95"
            : "bg-gradient-to-br from-emerald-500 to-green-700 hover:scale-110 hover:shadow-emerald-500/40"
        }`}
        title={open ? "Close chat" : "Open BioDex AI"}
      >
        {open ? <X className="h-6 w-6 text-white" /> : <MessageCircle className="h-6 w-6 text-white" />}

        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full animate-ping bg-emerald-400 opacity-20" />
        )}
      </button>

      {/* ── Chat Panel ── */}
      {open && (
        <div
          id="chatbot-panel"
          className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up"
          style={{ maxHeight: "75vh" }}
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-emerald-600 to-green-700 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">BioDex AI</p>
                <p className="text-[11px] text-white/75">India Biodiversity Assistant</p>
              </div>
            </div>
            <button onClick={clearChat} title="Clear chat" className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors">
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide" style={{ minHeight: 0 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                  msg.role === "bot" ? "bg-emerald-600" : "bg-blue-600"
                }`}>
                  {msg.role === "bot" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>

                <div className={`flex-1 space-y-2 ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
                  {/* Bubble */}
                  <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed max-w-[260px] ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-sm"
                      : "bg-secondary text-secondary-foreground rounded-tl-sm border border-border"
                  }`}>
                    {msg.role === "bot" ? renderText(msg.text) : msg.text}
                  </div>

                  {/* Result cards */}
                  {msg.results && msg.results.length > 0 && msg.resultType !== "none" && (
                    <div className="space-y-1.5 max-w-[260px] w-full">
                      {msg.results.slice(0, 3).map((item: any, j: number) => (
                        <button
                          key={j}
                          onClick={() => handleResultClick(item, msg.resultType || "species")}
                          className="w-full text-left px-3 py-2 bg-background border border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all text-xs group"
                        >
                          <div className="flex items-start gap-2">
                            <span className="mt-0.5 flex-shrink-0">
                              {msg.resultType === "plants" ? (
                                <Leaf className="h-3 w-3 text-emerald-500" />
                              ) : (
                                <Cat className="h-3 w-3 text-orange-500" />
                              )}
                            </span>
                            <div>
                              <p className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                {item.name}
                              </p>
                              <p className="text-muted-foreground italic line-clamp-1">{item.scientificName}</p>
                              <span className={`inline-block text-[9px] px-1.5 py-0.5 rounded-full mt-0.5 font-bold ${
                                item.conservationStatus === "Critically Endangered" ? "bg-red-100 text-red-700" :
                                item.conservationStatus === "Endangered" ? "bg-orange-100 text-orange-700" :
                                item.conservationStatus === "Vulnerable" ? "bg-yellow-100 text-yellow-700" :
                                "bg-green-100 text-green-700"
                              }`}>
                                {item.conservationStatus}
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5">
                <div className="h-7 w-7 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="px-3.5 py-2.5 bg-secondary border border-border rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1 items-center">
                    <div className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-4 pb-2 flex gap-1.5 overflow-x-auto scrollbar-hide flex-shrink-0">
            {QUICK_PROMPTS.map((p, i) => (
              <button
                key={i}
                onClick={() => sendMessage(p)}
                className="flex-shrink-0 text-[10px] px-2.5 py-1 rounded-full border border-border bg-secondary hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all whitespace-nowrap"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border flex gap-2 flex-shrink-0">
            <input
              ref={inputRef}
              id="chatbot-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Ask about any species or plant…"
              className="flex-1 bg-secondary border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/60"
            />
            <Button
              id="chatbot-send-btn"
              size="icon"
              disabled={loading || !input.trim()}
              onClick={() => sendMessage(input)}
              className="flex-shrink-0 h-9 w-9 rounded-xl bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

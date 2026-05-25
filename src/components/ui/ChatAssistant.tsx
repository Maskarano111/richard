import { useState, useRef, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Sparkles, AlertCircle, Trash2, Check } from "lucide-react";
import { Toast } from "./Toast";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

const SUGGESTED_PROMPTS = [
  { text: "What projects has Richard built?", id: "projects" },
  { text: "Tell me about Richard's experience.", id: "experience" },
  { text: "What are his core technical skills?", id: "skills" },
  { text: "How can I contact Richard?", id: "contact" },
];

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="my-3 rounded-lg overflow-hidden border border-white/10 bg-[#0c0c0e] w-full text-left">
      <div className="flex justify-between items-center px-4 py-2 bg-white/[0.03] border-b border-white/5 text-[11px] font-mono text-gray-400 select-none">
        <span>{language || "code"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer font-medium"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[12px] font-mono text-gray-300 leading-normal scrollbar-thin select-text">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize chat messages from sessionStorage or default welcome
  useEffect(() => {
    const saved = sessionStorage.getItem("portfolio_chat_messages");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to load chat history:", err);
        loadDefaultWelcome();
      }
    } else {
      loadDefaultWelcome();
    }
  }, []);

  function loadDefaultWelcome() {
    setMessages([
      {
        role: "assistant",
        content:
          "Hello! I am Richard's AI Assistant. Ask me anything about his projects, experience, technical skills, or how you can work together!",
      },
    ]);
  }

  // Save messages to sessionStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem("portfolio_chat_messages", JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Lock body scroll on mobile when chat panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Reset/Clear Conversation
  function handleClearChat() {
    if (window.confirm("Are you sure you want to clear the conversation?")) {
      sessionStorage.removeItem("portfolio_chat_messages");
      loadDefaultWelcome();
      setError(null);
    }
  }

  // Parse inline text formatting (bold, inline code)
  function parseInlineFormatting(text: string) {
    if (!text) return "";
    
    // Split by bold markdown (**bold**)
    const boldParts = text.split(/(\*\*.*?\*\*)/g);
    return boldParts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      
      // Split by backticks (`code`)
      const codeParts = part.split(/(`.*?`)/g);
      return codeParts.map((subPart, subIndex) => {
        if (subPart.startsWith("`") && subPart.endsWith("`")) {
          return (
            <code
              key={subIndex}
              className="px-1.5 py-0.5 rounded bg-white/10 text-xs font-mono text-brand-300"
            >
              {subPart.slice(1, -1)}
            </code>
          );
        }
        return subPart;
      });
    });
  }

  // Render message paragraphs, lists, and code blocks
  function renderMessageContent(content: string) {
    if (!content) return null;

    // Split by markdown code blocks (```code```)
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      const trimmedPart = part.trim();
      if (trimmedPart.startsWith("```") && trimmedPart.endsWith("```")) {
        const lines = trimmedPart.slice(3, -3).trim().split("\n");
        let language = "";
        let codeLines = lines;

        const firstLine = lines[0].trim();
        if (firstLine && !firstLine.includes(" ") && firstLine.length < 15) {
          language = firstLine;
          codeLines = lines.slice(1);
        }

        const codeString = codeLines.join("\n");
        return <CodeBlock key={index} code={codeString} language={language} />;
      }

      // Split into paragraphs by double newlines
      const paragraphs = part.split("\n\n");

      return paragraphs.map((paragraph, pIdx) => {
        const trimmed = paragraph.trim();
        if (!trimmed) return null;

        // Handle lists (lines starting with - or *)
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const items = trimmed.split("\n").map((item, iIdx) => {
            const cleanText = item.replace(/^[-*]\s+/, "");
            return (
              <li key={iIdx} className="ml-4 list-disc mb-1 last:mb-0">
                {parseInlineFormatting(cleanText)}
              </li>
            );
          });
          return (
            <ul key={`${index}-${pIdx}`} className="my-2 space-y-1">
              {items}
            </ul>
          );
        }

        // Standard paragraph
        return (
          <p key={`${index}-${pIdx}`} className="mb-2 last:mb-0">
            {parseInlineFormatting(paragraph)}
          </p>
        );
      });
    });
  }

  // Automated contact submission from chat
  async function submitContactFromChat(name: string, email: string, message: string) {
    try {
      // 1. Submit directly from client browser to Web3Forms to bypass Cloudflare bot challenge
      const web3FormsResponse = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          access_key: "aa4d9385-631b-4ce0-834a-c5ce5d00b704",
          name,
          email,
          message,
          subject: `New Portfolio Message from ${name} (via AI Chat)`
        })
      });

      if (!web3FormsResponse.ok) {
        const resData = await web3FormsResponse.json().catch(() => ({}));
        throw new Error(resData.message || "Failed Web3Forms submit");
      }

      // 2. Submit to local backend for record-keeping
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });
      
      if (response.ok) {
        setShowToast(true);
        setMessages((prev) => [
          ...prev,
          {
            role: "system",
            content: `Message submitted successfully on behalf of ${name} (${email})!`,
          },
        ]);
      } else {
        throw new Error("API return code error");
      }
    } catch (err) {
      console.error("AI contact form auto-submit error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: "Could not auto-submit contact form. Please use the contact form at the bottom of the page.",
        },
      ]);
    }
  }

  async function sendMessage(text: string) {
    if (!text.trim() || isLoading) return;

    setError(null);
    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Filter out system messages before sending history to Gemini
        body: JSON.stringify({
          messages: newMessages.filter((m) => m.role !== "system"),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get AI response");
      }

      const data = await response.json();
      const aiReply = data.message;

      // Check if reply contains contact submittal tag [SUBMIT_CONTACT: name | email | msg]
      const contactRegex = /\[SUBMIT_CONTACT:\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\]/;
      const match = aiReply.match(contactRegex);

      if (match) {
        const name = match[1];
        const email = match[2];
        const contactMsg = match[3];

        // Clean out the bracketed tag from the message shown to the user
        const cleanReply = aiReply.replace(contactRegex, "").trim();

        if (cleanReply) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: cleanReply },
          ]);
        }
        
        // Trigger backend submission
        await submitContactFromChat(name, email, contactMsg);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: aiReply },
        ]);
      }
    } catch (err: any) {
      console.error("Chat error:", err);
      setError(err.message || "Something went wrong. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close AI chat assistant" : "Open AI chat assistant"}
        className="w-14 h-14 bg-brand-500 hover:bg-brand-500/90 text-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(59,130,246,0.4)] hover:shadow-[0_4px_30px_rgba(59,130,246,0.6)] cursor-pointer transition-all duration-300 relative group border border-white/10"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageSquare size={24} />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#050505] animate-ping" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#050505]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hover label */}
        <span className="absolute right-16 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-xs font-medium text-white whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 shadow-xl hidden md:block">
          Chat with Richard's AI
        </span>
      </motion.button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="absolute bottom-18 right-0 w-[90vw] sm:w-[400px] h-[550px] rounded-2xl border border-white/10 backdrop-blur-xl bg-[#09090b]/85 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02] shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-500">
                    <Sparkles size={16} />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#09090b]" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-sm text-white">
                    Richard's Assistant
                  </h3>
                  <p className="text-[10px] font-light text-green-500 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 1 && (
                  <button
                    onClick={handleClearChat}
                    title="Reset conversation"
                    className="text-gray-400 hover:text-red-400 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                    aria-label="Clear chat"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Close chat window"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
              {messages.map((msg, index) => {
                if (msg.role === "system") {
                  return (
                    <div key={index} className="flex justify-center my-2">
                      <div className="bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-xl px-4 py-2 text-xs flex items-center gap-2 max-w-[90%] backdrop-blur-sm">
                        <Check size={14} className="shrink-0" />
                        <span>{msg.content}</span>
                      </div>
                    </div>
                  );
                }

                const isAssistant = msg.role === "assistant";
                return (
                  <div
                    key={index}
                    className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm font-light leading-relaxed ${
                        isAssistant
                          ? "bg-white/5 border border-white/5 text-gray-200 rounded-tl-none shadow-md"
                          : "bg-gradient-to-r from-brand-500 to-indigo-600 text-white rounded-tr-none shadow-[0_4px_12px_rgba(59,130,246,0.2)]"
                      }`}
                    >
                      {isAssistant ? (
                        renderMessageContent(msg.content)
                      ) : (
                        <p className="whitespace-pre-line">{msg.content}</p>
                      )}
                    </motion.div>
                  </div>
                );
              })}

              {/* Premium Loading Indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/5 border border-white/5 text-gray-400 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2"
                  >
                    <span className="text-xs font-light text-gray-500 mr-1 select-none">AI is writing</span>
                    <div className="flex gap-1 items-center">
                      {[0, 1, 2].map((idx) => (
                        <motion.span
                          key={idx}
                          className="w-1.5 h-1.5 bg-brand-500 rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: idx * 0.15,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="flex justify-center">
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-2.5 text-xs flex items-center gap-2 max-w-[90%]">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Chips (visible when not loading and input is empty) */}
            {messages.length === 1 && !isLoading && !input.trim() && (
              <div className="px-5 pb-3 pt-1 flex flex-wrap gap-1.5 shrink-0">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.id}
                    onClick={() => sendMessage(prompt.text)}
                    className="text-[11px] font-medium text-brand-500/90 bg-brand-500/10 border border-brand-500/20 px-3 py-1.5 rounded-full hover:bg-brand-500 hover:text-white hover:border-transparent transition-all duration-200 cursor-pointer text-left backdrop-blur-sm"
                  >
                    {prompt.text}
                  </button>
                ))}
              </div>
            )}

            {/* Footer Input Form */}
            <form
              onSubmit={handleSubmit}
              className="p-4 border-t border-white/10 bg-white/[0.01] flex items-center gap-2 shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about skills, projects, contact..."
                disabled={isLoading}
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder:text-gray-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
                className="w-9 h-9 bg-brand-500 hover:bg-brand-500/90 text-white rounded-full flex items-center justify-center shrink-0 disabled:bg-white/5 disabled:text-gray-600 disabled:border-transparent transition-all cursor-pointer shadow-[0_0_10px_rgba(59,130,246,0.2)]"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <Toast
        message="Message submitted successfully!"
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        type="success"
      />
    </div>
  );
}

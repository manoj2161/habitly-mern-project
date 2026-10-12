import { useRef, useState } from "react";
import { Bot, Send, X, Loader2, MessageCircle, Square } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const API_URL = "https://project-assistant-wr1v.onrender.com/api/chat";

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your Habitly assistant. Ask me anything about Habitly.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const abortControllerRef = useRef(null);

  const sendMessage = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isLoading) {
      return;
    }

    const userMessage = {
      role: "user",
      content: trimmedMessage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project: "habitly",
          message: trimmedMessage,
        }),
        signal: controller.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to get a response from the assistant.",
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message || data.response || "No response received.",
        },
      ]);
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error.message || "Something went wrong. Please try again later.",
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const cancelRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 z-50 flex h-[min(600px,calc(100vh-120px))] w-[min(390px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C7512A] text-white">
                <Bot size={21} />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Habitly Assistant
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <span className="h-2 w-2 rounded-full bg-[#C7512A]" />
                  AI Assistant
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              aria-label="Close assistant"
            >
              <X size={19} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4 dark:bg-gray-950">
            {messages.map((item, index) => {
              const isUser = item.role === "user";

              return (
                <div
                  key={index}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                      isUser
                        ? "rounded-br-md bg-[#C7512A] text-white"
                        : item.isError
                          ? "rounded-bl-md bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300"
                          : "rounded-bl-md border border-gray-200 bg-white text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                    }`}
                  >
                    {isUser ? (
                      item.content
                    ) : (
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {item.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Loading */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
                  <Loader2 size={16} className="animate-spin" />
                  Thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-end gap-2 rounded-xl border border-gray-200 bg-gray-50 p-2 focus-within:border-[#C7512A] dark:border-gray-700 dark:bg-gray-800">
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Habitly..."
                rows={1}
                disabled={isLoading}
                className="max-h-24 min-h-[40px] flex-1 resize-none bg-transparent px-2 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-60 dark:text-white"
              />

              {/* Cancel / Send */}
              {isLoading ? (
                <button
                  type="button"
                  onClick={cancelRequest}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#C7512A] text-white transition hover:opacity-90"
                  aria-label="Cancel request"
                  title="Cancel request"
                >
                  <Square size={16} fill="currentColor" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#C7512A] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              )}
            </div>

            <p className="mt-2 text-center text-[10px] text-gray-400">
              AI responses may not always be accurate.
            </p>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-2 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#C7512A] text-white shadow-lg transition duration-200 hover:scale-105 hover:shadow-xl"
          aria-label="Open Habitly Assistant"
        >
          <MessageCircle size={24} />
        </button>
      )}
    </>
  );
};

export default AIAssistant;

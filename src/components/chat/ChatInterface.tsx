"use client";

import { useEffect, useRef } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/lib/contexts/chat-context";

const SUGGESTIONS = [
  { label: "Pricing table", prompt: "Create a pricing table with Starter, Pro, and Enterprise tiers, each with a feature list and CTA button" },
  { label: "Dashboard stats", prompt: "Build a dashboard stats row with 4 metric cards showing revenue, users, orders, and growth rate" },
  { label: "User profile card", prompt: "Design a user profile card with avatar, name, job title, bio, and follower/following stats" },
  { label: "Login form", prompt: "Create a clean login form with email and password fields, a submit button, and a sign up link" },
];

export function ChatInterface() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { messages, input, setInput, handleInputChange, handleSubmit, status } = useChat();

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-5 py-8 gap-7">
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/25">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <p className="text-neutral-900 font-bold text-lg mb-1">What would you like to build?</p>
            <p className="text-neutral-500 text-sm max-w-xs">Describe a React component and see it rendered live</p>
          </div>
          <div className="flex flex-col gap-2 w-full">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                onClick={() => setInput(s.prompt)}
                className="flex items-center justify-between gap-3 text-left px-4 py-3 rounded-xl border border-neutral-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50 text-neutral-700 hover:text-indigo-700 transition-all group shadow-sm"
              >
                <span className="text-sm font-medium">{s.label}</span>
                <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-indigo-500 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <ScrollArea ref={scrollAreaRef} className="flex-1 overflow-hidden">
          <div className="pr-4">
            <MessageList messages={messages} isLoading={status === "streaming"} />
          </div>
        </ScrollArea>
      )}
      <div className="flex-shrink-0">
        <MessageInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={status === "submitted" || status === "streaming"}
        />
      </div>
    </div>
  );
}

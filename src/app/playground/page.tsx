"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import OpenAI from "openai";
import { type ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { toast } from "sonner";

import { env } from "@/env.mjs";
import { reactClient } from "@/trpc/react";
import { ChatInput } from "../_components/playground/ChatInput";
import { ChatMessages } from "../_components/playground/ChatMessages";
import { CodeSamples } from "../_components/playground/CodeSamples";
import { EmptyState } from "../_components/playground/EmptyState";
import { KeyboardShortcuts } from "../_components/playground/KeyboardShortcuts";
import { ParameterControls } from "../_components/playground/ParameterControls";
import { PlaygroundNav } from "../_components/playground/PlaygroundNav";
import { useAuth } from "../_components/providers";

export default function Example() {
  const auth = useAuth();
  const router = useRouter();
  const models = reactClient.model.getActiveChatModels.useQuery();
  const keys = reactClient.core.getApiKeys.useQuery();
  const first_key = keys.data?.[0]?.key ?? "";
  const [selected, setSelected] = useState<string | null>(null);
  const [isLoading, setIsloading] = useState(false);
  const [text, setText] = useState("");
  const [chats, setChats] = useState<Array<ChatCompletionMessageParam>>([]);
  const [params, setParams] = useState({
    temperature: 0.5,
    max_tokens: 500,
    top_p: 0.5,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  const [nav, setNav] = useState("ui");
  const [isParamsOpen, setIsParamsOpen] = useState(false);
  const client = useMemo(() => {
    return new OpenAI({
      baseURL: env.NEXT_PUBLIC_HUB_API_ENDPOINT + "/v1",
      apiKey: first_key,
      dangerouslyAllowBrowser: true,
    });
  }, [first_key]);
  const current_model = selected ?? models.data?.[0]?.name ?? null;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Add global keyboard listener for shortcuts helper
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle parameters: P
      if (e.key === "p") {
        // Only prevent when focused on the chat input
        if (document.activeElement === textareaRef.current) {
          return;
        }
        setIsParamsOpen((prev) => !prev);
        return;
      }

      // Show shortcuts when Command/Control is pressed alone
      if (e.key === "Meta" || e.key === "Control") {
        if (nav === "code") return;
        e.preventDefault();
        setShowShortcuts(true);
      }
      // Hide shortcuts when any other key is pressed
      else if (showShortcuts) {
        setShowShortcuts(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showShortcuts, setIsParamsOpen, nav]);

  const trigger = useCallback(
    async (chat: string, chatlog: typeof chats) => {
      if (!current_model) return;
      setText("");
      setIsloading(true);
      setChats((c) => [...c, { role: "user", content: chat }]);
      const stream = await client.chat.completions.create({
        stream: true,
        messages: [...chatlog, { role: "user", content: chat }],
        model: current_model,
        ...params,
      });
      setChats((c) => [...c, { role: "assistant", content: "" }]);
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        setChats((c) => {
          const cc = structuredClone(c);
          cc[cc.length - 1]!.content =
            ((cc[cc.length - 1]?.content as string) ?? "") + content;
          return cc;
        });
      }
      setIsloading(false);
    },
    [client, current_model, params],
  );

  const startChat = () => {
    if (!current_model) {
      toast.error("No model selected", {
        description: "Please select a model from the dropdown in the top right",
      });
      return;
    }
    setChats([]);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send message: Enter (without shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (text.trim() && !isLoading && current_model) {
        void trigger(text, chats);
        setHistoryIndex(-1);
      }
    }

    // New line: Shift + Enter
    if (e.key === "Enter" && e.shiftKey) {
      return; // Allow default behavior
    }

    // Blur input on Escape
    if (e.key === "Escape") {
      e.preventDefault();
      e.currentTarget.blur();
    }

    // Navigate message history: Up/Down arrows
    if (e.key === "ArrowUp" && !e.shiftKey) {
      e.preventDefault();
      const userMessages = chats.filter((msg) => msg.role === "user");
      if (userMessages.length > 0) {
        const newIndex = historyIndex + 1;
        if (newIndex < userMessages.length) {
          const message =
            userMessages[userMessages.length - 1 - newIndex]?.content ?? "";
          setHistoryIndex(newIndex);
          setText(message as string);
        }
      }
    }

    if (e.key === "ArrowDown" && !e.shiftKey) {
      e.preventDefault();
      const userMessages = chats.filter((msg) => msg.role === "user");
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        const message =
          userMessages[userMessages.length - 1 - newIndex]?.content ?? "";
        setHistoryIndex(newIndex);
        setText(message as string);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setText("");
      }
    }
  };

  if (auth.status === "UNAUTHED") {
    router.push("/sign-in");
  }

  if (keys.data?.length === 0) {
    return (
      <div>
        Looks like you dont have any api keys! Go make one and come back
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-[calc(100vh-4rem)] flex-col pt-7 lg:flex-row">
        {/* Parameter Controls - Move before main content for desktop */}
        <ParameterControls
          params={params}
          setParams={setParams}
          isOpen={isParamsOpen}
          setIsOpen={setIsParamsOpen}
        />

        {/* Main Content */}
        <main className="flex min-h-0 flex-1 flex-col">
          {/* Navigation */}
          <PlaygroundNav
            nav={nav}
            setNav={setNav}
            current_model={current_model}
            setSelected={setSelected}
            models={models}
            isParamsOpen={isParamsOpen}
            setIsParamsOpen={setIsParamsOpen}
          />

          {/* Content Area */}
          {nav === "ui" ? (
            <div className="relative flex flex-1 flex-col">
              {chats.length === 0 ? (
                <div className="absolute inset-0 bottom-16 overflow-y-auto">
                  <EmptyState startChat={startChat} />
                </div>
              ) : (
                <div className="absolute inset-0 bottom-16">
                  <ChatMessages messages={chats} />
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
                <ChatInput
                  text={text}
                  setText={setText}
                  onSend={() => trigger(text, chats)}
                  isLoading={isLoading}
                  current_model={current_model}
                  textareaRef={textareaRef}
                  onKeyDown={handleKeyDown}
                  onShowShortcuts={() => setShowShortcuts(true)}
                  hasChat={chats.length > 0}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col overflow-hidden">
              <CodeSamples
                model={current_model}
                apiKey={first_key}
                params={params}
              />
            </div>
          )}
        </main>
      </div>

      <KeyboardShortcuts
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </>
  );
}

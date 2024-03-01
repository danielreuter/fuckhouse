"use client";

import { useEffect, useState, useTransition } from "react";
import { NewPromptForm } from "@/components/chat/prompt-form";
import { MenuButton } from "../buttons/menu-button";
import { useChat } from "@/lib/hooks/use-chat";
import { Bubble } from "./bubble";

export function ChatBubble() {
  const [isOpening, startTransition] = useTransition();
  const [opened, setOpened] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    setOpened(true);
    setTimeout(() => {
      setExpanded(true);
    }, 1000);
  }, []);
  const {
    messages,
    append,
    reload,
    stop,
    isLoading,
    input,
    setInput,
    handleSubmit,
  } = useChat();
  return (
    <>
      <Bubble isVisible={true} size="lg" y="bottom" x="center">
        <div className="relative w-[768px] max-w-full flex pr-3 justify-center items-center rounded-full">
          <NewPromptForm
            handleSubmit={handleSubmit}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
          />
          {/* <AssistantNotificationBubble
            isVisible={true}
            onDismiss={() => {
              setExpanded(false);
              setTimeout(() => {
                setExpanded(true);
              }, 1500);
            }}
          /> */}
        </div>
      </Bubble>
    </>
  );
}

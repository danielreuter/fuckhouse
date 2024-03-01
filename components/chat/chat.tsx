"use client";

import { useEffect, useState, useTransition } from "react";
import { NewPromptForm } from "@/components/chat/prompt-form";
import { MenuButton } from "../buttons/menu-button";
import { useChat } from "@/lib/hooks/use-chat";
import { Bubble } from "./bubble";

export function Chat() {
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
      <div className="bg-[#222221eb] relative w-[768px] max-w-full flex pr-3 justify-center items-center rounded-full">
        <NewPromptForm
          handleSubmit={handleSubmit}
          input={input}
          setInput={setInput}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}

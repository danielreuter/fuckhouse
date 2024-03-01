import { StateCreator } from "zustand";
import { type Message } from "ai";
import { Store } from "@/lib/store";

export interface ChatSettersStore {
  setMessages: (messages: Message[]) => void;
  setInput: (input: string) => void;
  setError: (error: Error | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setAbortController: (abortController: AbortController | null) => void;
}

export const createChatSettersStore: StateCreator<
  Store,
  [],
  [],
  ChatSettersStore
> = (set, get) => ({
  setMessages: (messages) =>
    set((store) => ({ ...store, chat: { ...store.chat, messages } })),
  setInput: (input) =>
    set((store) => ({
      ...store,
      chat: { ...store.chat, data: { ...store.chat.data, input } },
    })),
  setError: (error) =>
    set((store) => ({
      ...store,
      chat: { ...store.chat, data: { ...store.chat.data, error } },
    })),
  setIsLoading: (isLoading) =>
    set((store) => ({
      ...store,
      chat: { ...store.chat, data: { ...store.chat.data, isLoading } },
    })),
  setAbortController: (abortController) =>
    set((store) => ({
      ...store,
      chat: { ...store.chat, data: { ...store.chat.data, abortController } },
    })),
});

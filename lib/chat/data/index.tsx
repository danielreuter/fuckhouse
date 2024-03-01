import { StateCreator } from "zustand";
import { type Message } from "ai";
import { Store } from "@/lib/store";

export interface ChatDataStore {
  input: string;
  messages: Array<Message>;
  abortController: AbortController | null;
  isLoading: boolean;
  error: Error | null;
  extraMetadata: {
    credentials: RequestCredentials | undefined;
    headers: Record<string, string> | Headers | undefined;
    body: object | undefined;
  };
}

export const createChatDataStore: StateCreator<Store, [], [], ChatDataStore> = (
  set,
  get,
) => ({
  input: "",
  messages: [],
  abortController: null,
  isLoading: false,
  error: null,
  extraMetadata: {
    credentials: undefined,
    headers: undefined,
    body: undefined,
  },
});

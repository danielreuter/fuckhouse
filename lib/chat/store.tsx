import {
  ChatRequest,
  ChatRequestOptions,
  CreateMessage,
  JSONValue,
  Message,
} from "ai";
import { StateCreator } from "zustand";
import { ChatDataStore, createChatDataStore } from "./data";
import { ChatActionsStore, createChatActionsStore } from "./actions";
import { ChatHandlersStore, createChatHandlersStore } from "./handlers";
import { ChatSettersStore, createChatSettersStore } from "./setters";
import { Store } from "@/lib/store";

export interface ChatStore {
  data: ChatDataStore;
  actions: ChatActionsStore;
  handlers: ChatHandlersStore;
  setters: ChatSettersStore;
}

export const createChatStore: StateCreator<Store, [], [], ChatStore> = (
  ...a
) => ({
  data: { ...createChatDataStore(...a) },
  actions: { ...createChatActionsStore(...a) },
  handlers: { ...createChatHandlersStore(...a) },
  setters: { ...createChatSettersStore(...a) },
});

export function createChatRequest(
  messages: Array<Message>,
  args: ChatRequestOptions,
): ChatRequest {
  const { options, functions, function_call } = args;
  return {
    messages,
    options,
    ...(functions !== undefined && { functions }),
    ...(function_call !== undefined && { function_call }),
  };
}

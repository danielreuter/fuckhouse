import { StateCreator } from "zustand";
import { Store } from "@/lib/store";
import {
  ChatRequest,
  ChatRequestOptions,
  CreateMessage,
  FunctionCall,
  JSONValue,
  Message,
} from "ai";
import { createChatRequest } from "../store";
import { nanoid } from "@/lib/utils";
import _ from "lodash";
import { actions } from "@/server/actions";
import { readPromiseStream } from "@/server/actions/generate/promise-stream";
import { move } from "@/lib/game/move";

export type AssistantPayload = {
  chunk: string;
  recipe?: {
    render: string;
    element: JSX.Element;
  };
};

export type StreamingPayload = AssistantPayload & {
  next: null | Promise<StreamingPayload>;
};

export interface ChatActionsStore {
  uploadBlueprint: (
    blueprint: any,
    route: string,
  ) => Promise<{ status: "succeeded" }>;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Array<Message>;
  reload: (
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
  stop: () => void;

  generateMove: (messages: Array<Message>) => void;
}

export const createChatActionsStore: StateCreator<
  Store,
  [],
  [],
  ChatActionsStore
> = (set, get) => ({
  uploadBlueprint: async (blueprint, route) => {
    console.log("Uploading blueprint", { blueprint, route });
    const response = await fetch("/api/page/upload-blueprint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route,
        blueprint,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to upload blueprint");
    }
    return response.json();
  },

  generateMove: async (messages) => {
    const engine = get().engine;
    const dataSet = new Set<string>();
    actions
      .generate({
        request: messages[messages.length - 1].content,
        board: engine.ascii(),
        turn: engine.turn(),
        history: engine.history(),
      })
      .then((result) => {
        readPromiseStream(move, result, (data) => {
          console.warn("success");
          const moveData = data.dump();
          const moveString = moveData.movement.toString();
          if (dataSet.has(moveString)) {
            return;
          }
          dataSet.add(moveString);
          console.warn(data);
          engine.move(data.dump());
        });
      });
  },

  reload: async (chatRequestOptions) => {
    const { options, functions, function_call } = chatRequestOptions || {};
    const {
      data: { messages },
    } = get().chat;

    if (messages.length === 0) return null;

    // Remove last assistant message and retry last user message.
    const lastMessage = messages[messages.length - 1];

    const trimmedMessages =
      lastMessage.role === "assistant" ? messages.slice(0, -1) : messages;
    const chatRequest = createChatRequest(trimmedMessages, {
      options,
      functions,
      function_call,
    });

    // return triggerRequest({
    //   endpoint: "api/assistant/tasks/ui/design-skeleton",
    //   chatRequest,
    //   writeFunctionsTo: "scratchpad",
    // });
  },

  append: (message) => {
    console.log("[append] - start -", { message });
    const {
      chat: {
        data: { messages },
      },
    } = get();
    const newMessages = [
      ...messages,
      {
        id: nanoid(),
        ...message,
      },
    ];
    set((state) => ({
      chat: {
        ...state.chat,
        messages: newMessages,
      },
    }));
    console.log("[append] - after setting new messages -", { newMessages });
    return newMessages;
  },

  stop: () => {
    const {
      data: { abortController },
      setters: { setAbortController },
    } = get().chat;
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
  },
});

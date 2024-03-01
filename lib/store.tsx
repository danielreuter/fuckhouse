import { create } from "zustand";
import { enableMapSet } from "immer";
import z from "@/packages/mod";
import { nothing, produce } from "immer";
import { ChatStore, createChatStore } from "./chat/store";
import { engine } from "./game/engine";

enableMapSet();

export interface Store {
  engine: z.infer<typeof engine>;
  chat: ChatStore;
}

export type SetFn = (store: Store) => void;
export type Setter = (fn: SetFn) => void;

export const useStore = create<Store>()((...a) => {
  const [setStore, get] = a;

  function set(fn: SetFn) {
    setInPlace(setStore, fn);
  }
  const initEngine = engine.from(
    {
      board: {
        turn: "white",
      },
      history: [],
    },
    { set },
  );
  return {
    engine: initEngine,
    chat: createChatStore(...a),
  };
});

export const useEngine = () => {
  return useStore((store) => store.engine);
};

// borrowed from immer... should test this
type ValidRecipeReturnType<State> =
  | State
  | void
  | undefined
  | (State extends undefined ? typeof nothing : never);
export function setInPlace<T>(
  set: (
    partial: T | Partial<T> | ((state: T) => T | Partial<T>),
    replace?: boolean | undefined,
  ) => void,
  mutation: (draft: T) => ValidRecipeReturnType<T>,
) {
  set((store) => produce(store, mutation));
}

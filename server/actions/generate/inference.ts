"use server";

import { Message } from "ai";
import { SmartLanguage } from "./model";
import { PromiseStream } from "./promise-stream";
import { action } from "../action";
import z from "@/packages/mod";

const registry = {
  [SmartLanguage.identifier]: SmartLanguage,
};

type Keys = keyof typeof registry;
type Registry = typeof registry;

export async function executeInference<K extends Keys>(
  key: K,
  input: Registry[K]["_"]["input"],
): Promise<PromiseStream> {
  const model = registry[key];
  const output = await model.infer(input);
  return new PromiseStream(output);
}

export const runInference = action(
  z.object({
    request: z.string(),
    board: z.string(),
    turn: z.string(),
  }),
  async (input) => {
    const model = SmartLanguage;
    const output = await model.infer(input);
    return new PromiseStream(output);
  },
);

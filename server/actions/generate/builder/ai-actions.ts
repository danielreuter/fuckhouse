"use server";

import z from "@/packages/mod";
import { PromiseStream, PromiseStreamPayload } from "../promise-stream";
import { action } from "../../action";
import { openai } from "@/lib/openai";
import { OpenAIStream } from "ai";

const message = z.object({
  content: z.string(),
  role: z.enum(["system", "user"]),
});

const smartLanguageArgs = z.object({
  messages: message.array(),
});

export const smartLanguage = action(smartLanguageArgs, async ({ messages }) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages,
    stream: true,
  });
  const stream = OpenAIStream(response);
  return new PromiseStream(stream);
});

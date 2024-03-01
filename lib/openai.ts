import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function openAI(
  input: OpenAI.ChatCompletionCreateParamsStreaming,
) {
  return await openai.chat.completions.create(input);
}

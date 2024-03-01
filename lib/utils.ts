import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";
import { omit } from "lodash";
import zodToJsonSchema from "@/packages/json-schema";
import z from "@/packages/mod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7,
); // 7-character random string

export function createJsonSchema(schema: z.ZodType): any {
  return omit(zodToJsonSchema(schema), "$schema");
}

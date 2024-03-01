"use server";

import z from "@/packages/mod";
import { Action, action } from "../action";
import { db, schema as s } from "@/server/db";
import { and, desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { insert } from "@/packages/orm/drizzle-mod";

export const createApp = action(
  z.object({
    domain: z.string(),
  }),
  async ({ domain }) => {},
);

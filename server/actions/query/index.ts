"use server";

import z from "@/packages/mod";
import { Action, action } from "../action";
import { db, schema as s } from "@/server/db";
import { and, desc, eq, sql } from "drizzle-orm";

export const findAllApps = action(z.object({}), async () => {});

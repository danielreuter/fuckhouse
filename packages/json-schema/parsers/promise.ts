import { ZodPromiseDef } from "@/packages/mod";
import { JsonSchema7Type, parseDef } from "../parseDef";
import { Refs } from "../Refs";

export function parsePromiseDef(
  def: ZodPromiseDef,
  refs: Refs,
): JsonSchema7Type | undefined {
  return parseDef(def.type._def, refs);
}

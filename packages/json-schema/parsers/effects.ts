import { ZodEffectsDef } from "@/packages/mod";
import { JsonSchema7Type, parseDef } from "../parseDef";
import { Refs } from "../Refs";

export function parseEffectsDef(
  _def: ZodEffectsDef,
  refs: Refs,
): JsonSchema7Type | undefined {
  return refs.effectStrategy === "input"
    ? parseDef(_def.schema._def, refs)
    : {};
}

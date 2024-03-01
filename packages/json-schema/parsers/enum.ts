import { ZodEnumDef } from "@/packages/mod";

export type JsonSchema7EnumType = {
  type: "string";
  enum: string[];
};

export function parseEnumDef(def: ZodEnumDef): JsonSchema7EnumType {
  return {
    type: "string",
    enum: def.values,
  };
}

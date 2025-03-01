import { ZodCatchDef } from "@/packages/mod";
import { parseDef } from "../parseDef";
import { Refs } from "../Refs";

export const parseCatchDef = (def: ZodCatchDef<any>, refs: Refs) => {
  return parseDef(def.innerType._def, refs);
};

import z from "@/packages/mod";

export const player = z.enum(["white", "black"]);
export type Player = z.infer<typeof player>;

import z from "@/packages/mod";
import { player } from "./player";

export const movement = z
  .string()
  .transform((s, ctx) => {
    const [from, to] = s.split(":");
    const fromMatch = from.match(/^([a-z])([1-9]|1[0-9]|2[0-6])$/);
    const toMatch = to.match(/^([a-z])([1-9]|1[0-9]|2[0-6])$/);

    if (!fromMatch || !toMatch) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid movement format",
      });
      return z.NEVER;
    }

    const fromX = fromMatch[1].charCodeAt(0) - "a".charCodeAt(0);
    const fromY = parseInt(fromMatch[2], 10) - 1;
    const toX = toMatch[1].charCodeAt(0) - "a".charCodeAt(0);
    const toY = parseInt(toMatch[2], 10) - 1;

    return { from: [fromX, fromY], to: [toX, toY], toString: () => s };
  })
  .describe(
    "A movement from one square to another split by a ':'.\n" +
      "Examples: a7:g7, a7:a1, a7:g1, a7:a7, c3:b5",
  );

const moveData = z.object({
  player: player,
  movement: movement,
});

export const move = moveData.interpret<{
  dump: () => Move;
}>(({ _, set }) => ({
  _,
  dump() {
    return this._;
  },
}));

export type Move = z.infer<typeof moveData>;

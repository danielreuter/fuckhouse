import z from "@/packages/mod";
import { Piece, p } from "../piece";
import { player } from "../player";
import { useEngine } from "../../store";
import { Squares } from "./squares";

export type BoardState = (Piece | null)[][];

const { Rook, Knight, Bishop, Queen, King, Pawn } = p;

export const board = z
  .object({
    turn: player,
  })
  .transform((d) => {
    const state: BoardState = [
      // File 'a' to 'h' for Rank 1 (White's back rank)
      [
        new Rook("white"),
        new Pawn("white"),
        null,
        null,
        null,
        null,
        new Pawn("black"),
        new Rook("black"),
      ],
      // File 'a' to 'h' for Rank 2 (White's knights)
      [
        new Knight("white"),
        new Pawn("white"),
        null,
        null,
        null,
        null,
        new Pawn("black"),
        new Knight("black"),
      ],
      // File 'a' to 'h' for Rank 3 (White's bishops)
      [
        new Bishop("white"),
        new Pawn("white"),
        null,
        null,
        null,
        null,
        new Pawn("black"),
        new Bishop("black"),
      ],
      // File 'a' to 'h' for Rank 4 (White's queen)
      [
        new Queen("white"),
        new Pawn("white"),
        null,
        null,
        null,
        null,
        new Pawn("black"),
        new Queen("black"),
      ],
      // File 'a' to 'h' for Rank 5 (White's king)
      [
        new King("white"),
        new Pawn("white"),
        null,
        null,
        null,
        null,
        new Pawn("black"),
        new King("black"),
      ],
      // File 'a' to 'h' for Rank 6 (White's bishops)
      [
        new Bishop("white"),
        new Pawn("white"),
        null,
        null,
        null,
        null,
        new Pawn("black"),
        new Bishop("black"),
      ],
      // File 'a' to 'h' for Rank 7 (White's knights)
      [
        new Knight("white"),
        new Pawn("white"),
        null,
        null,
        null,
        null,
        new Pawn("black"),
        new Knight("black"),
      ],
      // File 'a' to 'h' for Rank 8 (White's rooks)
      [
        new Rook("white"),
        new Pawn("white"),
        null,
        null,
        null,
        null,
        new Pawn("black"),
        new Rook("black"),
      ],
    ];
    return {
      ...d,
      state,
    };
  });

interface Props {
  state: BoardState;
}

export function MinimalBoard({ state }: Props) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Squares boardState={state} />
    </div>
  );
}

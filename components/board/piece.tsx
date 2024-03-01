import React, { FC } from "react";
import { Piece as PieceClass } from "../../lib/game/piece";

interface PieceProps {
  piece: PieceClass | null;
  width: number;
}

function Piece({ piece, width }: PieceProps) {
  return (
    <>
      {piece ? (
        <svg viewBox={"1 1 43 43"} width={width} height={width}>
          <g>{piece.element()}</g>
        </svg>
      ) : (
        <div className="h-full w-full"></div>
      )}
    </>
  );
}

export default Piece;

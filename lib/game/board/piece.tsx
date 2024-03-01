import React, { FC } from "react";
import { Piece as PieceClass } from "../piece";

interface PieceProps {
  piece: PieceClass | null;
}

function Piece({ piece }: PieceProps) {
  const pieceStyle = {
    width: "12.5%",
    height: "12.5%",
  };

  return <div style={pieceStyle}>{piece && piece.element()}</div>;
}

export default Piece;

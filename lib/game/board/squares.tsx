import React from "react";
import { BoardState } from ".";
import Piece from "./piece";
import { Square } from "./square";

type SquaresProps = {
  boardState: BoardState;
};

export const Squares = ({ boardState }: SquaresProps) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      {boardState.flat().map((piece, index) => {
        const squareColor =
          (Math.floor(index / 8) + index) % 2 === 0 ? "white" : "black";
        return (
          <Square key={index} squareColor={squareColor}>
            <Piece piece={piece} />
          </Square>
        );
      })}
    </div>
  );
};

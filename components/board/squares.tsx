import React from "react";
import Piece from "./piece";
import { Square } from "./square";
import { BoardState } from "@/lib/game/board";

type SquaresProps = {
  state: BoardState;
  width: number;
};

export const Squares = ({ state, width }: SquaresProps) => {
  return (
    <div className="w-full h-full flex">
      {state.map((column, j) => (
        <div key={j} className="flex flex-col-reverse w-full h-full bg-muted">
          {column.map((piece, i) => {
            const color = i % 2 === j % 2 ? "light" : "dark";
            return (
              <Square key={i} color={color} width={width / 8}>
                <Piece piece={piece} width={width / 8} />
              </Square>
            );
          })}
        </div>
      ))}
    </div>
  );
};

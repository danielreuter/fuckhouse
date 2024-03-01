import React from "react";

type SquareProps = {
  children: React.ReactNode;
  squareColor: "white" | "black";
};

export const Square = ({ squareColor, children }: SquareProps) => {
  const squareStyle = {
    width: "12.5%", // Assuming 8x8 board, each square is 12.5% of the board width
    height: "12.5%",
    backgroundColor: squareColor === "black" ? "gray" : "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return <div style={squareStyle}>{children}</div>;
};

import React from "react";

type SquareProps = {
  children: React.ReactNode;
  color: "light" | "dark";
  width: number;
};

export const Square = ({ color, children, width }: SquareProps) => {
  const squareStyle = {
    width,
    height: width,
    backgroundColor: color === "light" ? "#F0D9B5" : "#B58863",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return <div style={squareStyle}>{children}</div>;
};

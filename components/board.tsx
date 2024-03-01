"use client";

import { Chessboard } from "react-chessboard";
import { useEngine } from "@/lib/store";
import { useEffect } from "react";
import { createJsonSchema } from "@/lib/utils";
import { movement } from "@/lib/game/move";
import { MinimalBoard } from "@/lib/game/board";

export function Board() {
  const engine = useEngine();
  const firstMove = movement.parse("a2:a3");
  useEffect(() => {
    engine.move({ player: "white", movement: firstMove });
  }, []);
  console.log(engine.ascii());
  return (
    <div className="w-full h-full relative flex-1">
      <MinimalBoard state={engine._.board.state} />
    </div>
  );
}

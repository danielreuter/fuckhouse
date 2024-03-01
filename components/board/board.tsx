"use client";

import { useEngine } from "@/lib/store";
import { useEffect, useMemo, useRef, useState } from "react";
import { movement } from "@/lib/game/move";
import { Square } from "@/components/board/square";
import Piece from "@/components/board/piece";
import { Squares } from "./squares";
import { Chessboard } from "react-chessboard";
import { WinnerModal } from "./winner-modal";
import ConfettiExplosion from "react-confetti-explosion";

export function Board() {
  const engine = useEngine();
  const firstMove = movement.parse("a2:a3");
  // useEffect(() => {
  //   engine.move({ player: "white", movement: firstMove });
  // }, []);
  const [clientWindow, setClientWindow] = useState<Window>();
  const [isMobile, setIsMobile] = useState(false);
  const [boardWidth, setBoardWidth] = useState<number>();

  const boardRef = useRef<HTMLObjectElement>(null);
  const boardContainerRef = useRef<HTMLDivElement>(null);

  const [boardContainerPos, setBoardContainerPos] = useState({
    left: 0,
    top: 0,
  });

  const metrics = useMemo(
    () => boardRef.current?.getBoundingClientRect(),
    [boardRef.current],
  );

  console.log(engine._.history);

  useEffect(() => {
    setBoardContainerPos({
      left: metrics?.left ? metrics?.left : 0,
      top: metrics?.top ? metrics?.top : 0,
    });
  }, [metrics]);

  useEffect(() => {
    setIsMobile("ontouchstart" in window);
    setClientWindow(window);
  }, []);

  useEffect(() => {
    if (boardRef.current?.offsetWidth) {
      const resizeObserver = new ResizeObserver(() => {
        setBoardWidth(boardRef.current?.offsetWidth as number);
      });
      resizeObserver.observe(boardRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [boardRef.current, clientWindow]);

  const winner = engine.winner();
  return (
    <div className="h-full w-full">
      {winner && (
        <>
          <ConfettiExplosion />
          <WinnerModal player={winner} winner={winner} />
        </>
      )}
      <div
        ref={boardContainerRef}
        className="flex flex-col w-full"
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <div ref={boardRef} className="w-full">
          <div style={{ perspective: "1000px" }}>
            <div
              ref={boardRef}
              style={{
                position: "relative",
                cursor: "default",
                height: boardWidth,
                width: boardWidth,
              }}
            >
              {boardWidth && (
                <Squares state={engine._.board.state} width={boardWidth} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

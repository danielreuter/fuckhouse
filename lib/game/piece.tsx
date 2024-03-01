import z from "@/packages/mod";
import { Player, player } from "./player";
import { BoardState } from "./board";
import Chesspieces from "@/components/chesspieces/standard";

type Coordinate = [number, number];

type ValidateMoveArgs = {
  from: Coordinate;
  to: Coordinate;
  player: Player;
  board: BoardState;
};

export type PieceType = "N" | "B" | "R" | "Q" | "K" | "P";

interface PieceBase {
  type: PieceType;
  player: Player;
  validateMove: (args: ValidateMoveArgs) => boolean;
  element: () => React.ReactNode;
}

class Pawn implements PieceBase {
  player: Player;
  type: "P" = "P";

  constructor(player: Player) {
    this.player = player;
  }

  element() {
    return this.player === "white" ? Chesspieces.wP : Chesspieces.bP;
  }

  validateMove({ from, to, player, board }: ValidateMoveArgs): boolean {
    const [fromX, fromY] = from;
    const [toX, toY] = to;

    if (this.player !== player) return false;

    const direction = this.player === "white" ? 1 : -1;
    const startingRow = this.player === "white" ? 1 : 6;

    // Move one square forward
    console.log({ from, to, player, board });
    if (fromY + direction === toY && fromX === toX) return true;

    // Move two squares forward from the starting position
    console.log({ fromY, toY, fromX, toX, startingRow, direction });
    if (fromY === startingRow && toY === fromY + 2 * direction && fromX === toX)
      return true;

    // Capture diagonally
    console.log({ fromY, toY, fromX, toX, direction });
    if (fromY + direction === toY && (fromX + 1 === toX || fromX - 1 === toX))
      return true;

    return false;
  }
}

class Knight implements PieceBase {
  player: Player;
  type: "N" = "N";

  constructor(player: Player) {
    this.player = player;
  }

  element() {
    return this.player === "white" ? Chesspieces.wN : Chesspieces.bN;
  }

  validateMove({ from, to, player, board }: ValidateMoveArgs): boolean {
    const [fromX, fromY] = from;
    const [toX, toY] = to;
    if (this.player !== player) return false;

    const dx = Math.abs(toX - fromX);
    const dy = Math.abs(toY - fromY);
    return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
  }
}

class Bishop implements PieceBase {
  player: Player;
  type: "B" = "B";

  constructor(player: Player) {
    this.player = player;
  }

  element() {
    return this.player === "white" ? Chesspieces.wB : Chesspieces.bB;
  }

  validateMove({ from, to, player, board }: ValidateMoveArgs): boolean {
    const [fromX, fromY] = from;
    const [toX, toY] = to;
    if (this.player !== player) return false;
    return isDiagonalPathClear(fromX, fromY, toX, toY, board);
  }
}

class Rook implements PieceBase {
  player: Player;
  type: "R" = "R";

  constructor(player: Player) {
    this.player = player;
  }

  element() {
    return this.player === "white" ? Chesspieces.wR : Chesspieces.bR;
  }

  validateMove({ from, to, player, board }: ValidateMoveArgs): boolean {
    const [fromX, fromY] = from;
    const [toX, toY] = to;
    if (this.player !== player) return false;
    return isStraightPathClear(fromX, fromY, toX, toY, board);
  }
}

class Queen implements PieceBase {
  player: Player;
  type: "Q" = "Q";

  constructor(player: Player) {
    this.player = player;
  }

  element() {
    return this.player === "white" ? Chesspieces.wQ : Chesspieces.bQ;
  }

  validateMove({ from, to, player, board }: ValidateMoveArgs): boolean {
    const [fromX, fromY] = from;
    const [toX, toY] = to;
    if (this.player !== player) return false;

    const dx = Math.abs(fromX - toX);
    const dy = Math.abs(fromY - toY);
    if (dx === dy) {
      return isDiagonalPathClear(fromX, fromY, toX, toY, board);
    } else {
      return isStraightPathClear(fromX, fromY, toX, toY, board);
    }
  }
}

class King implements PieceBase {
  player: Player;
  type: "K" = "K";

  constructor(player: Player) {
    this.player = player;
  }

  element() {
    return this.player === "white" ? Chesspieces.wK : Chesspieces.bK;
  }

  validateMove({ from, to, player, board }: ValidateMoveArgs): boolean {
    const [fromX, fromY] = from;
    const [toX, toY] = to;
    if (this.player !== player) return false;

    const dx = Math.abs(toX - fromX);
    const dy = Math.abs(toY - fromY);
    return dx <= 1 && dy <= 1 && dx + dy > 0;
  }
}

function isStraightPathClear(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  board: (Piece | null)[][],
): boolean {
  if (fromX !== toX && fromY !== toY) {
    // Not a straight path
    return false;
  }

  const xDirection = Math.sign(toX - fromX);
  const yDirection = Math.sign(toY - fromY);

  let currentX = fromX + xDirection;
  let currentY = fromY + yDirection;

  while (currentX !== toX || currentY !== toY) {
    if (board[currentX][currentY]) {
      // Path is blocked
      return false;
    }
    currentX += xDirection;
    currentY += yDirection;
  }

  return true;
}

function isDiagonalPathClear(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  board: (Piece | null)[][],
): boolean {
  if (Math.abs(toX - fromX) !== Math.abs(toY - fromY)) {
    // Not a diagonal path
    return false;
  }

  const xDirection = Math.sign(toX - fromX);
  const yDirection = Math.sign(toY - fromY);

  let currentX = fromX + xDirection;
  let currentY = fromY + yDirection;

  while (currentX !== toX && currentY !== toY) {
    if (board[currentX][currentY]) {
      // Path is blocked
      return false;
    }
    currentX += xDirection;
    currentY += yDirection;
  }

  return true;
}

export type Piece = Knight | Bishop | Rook | Queen | King | Pawn;

export const p = {
  Knight,
  Bishop,
  Rook,
  Queen,
  King,
  Pawn,
};

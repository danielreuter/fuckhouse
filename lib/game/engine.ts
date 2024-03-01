import z from "@/packages/mod";
import { Player, player } from "./player";
import { BoardState, board } from "./board";
import { Move } from "./move";
import { Piece, p } from "./piece";

const { Rook, Knight, Bishop, Queen, King, Pawn } = p;

export const engine = z
  .object({
    board: board,
  })
  .interpret<{
    move: (m: Move) => void;
    fen: () => string;
    ascii: () => string;
    turn: () => Player;
  }>(({ _, set }) => ({
    _,
    turn() {
      return this._.board.turn;
    },
    move(m) {
      try {
        const { board } = this._;
        validateMove(board.state, m);
        const { player, movement } = m;
        const {
          from: [fromX, fromY],
          to: [toX, toY],
        } = movement;
        const piece = board.state[fromX][fromY];
        set(({ engine }) => {
          const { board } = engine._;
          board.state[toX][toY] = piece;
          board.state[fromX][fromY] = null;
          if (player === "white") {
            board.turn = "black";
          } else {
            board.turn = "white";
          }
        });
      } catch (e) {
        console.error(e);
      }
    },
    fen() {
      return generateFen(this._.board.state);
    },
    ascii() {
      return getAsciiBoard(this._.board.state);
    },
  }));

function validateMove(board: BoardState, move: Move): true {
  const {
    player,
    movement: {
      from: [fromX, fromY],
      to: [toX, toY],
    },
  } = move;

  // Check it's moving to a square that is within bounds
  if (toX < 0 || toX > 7 || toY < 0 || toY > 7) {
    throw new Error("Move is out of bounds");
  }

  // Check this piece is on the board at the from square, and that it's the right piece
  const piece = board[fromX][fromY];
  if (!piece) throw new Error("No piece at from square");
  if (piece.player !== player) {
    throw new Error("Piece does not belong to player");
  }

  // Check the move is valid for this piece
  let pieceInstance;
  switch (piece.type) {
    case "P":
      pieceInstance = new Pawn(player);
      break;
    case "N":
      pieceInstance = new Knight(player);
      break;
    case "B":
      pieceInstance = new Bishop(player);
      break;
    case "R":
      pieceInstance = new Rook(player);
      break;
    case "Q":
      pieceInstance = new Queen(player);
      break;
    case "K":
      pieceInstance = new King(player);
      break;
    default:
      throw new Error("Unknown piece type");
  }
  console.warn({
    from: [fromX, fromY],
    to: [toX, toY],
    player,
    board,
    piece: pieceInstance,
  });
  if (
    !pieceInstance.validateMove({
      from: [fromX, fromY],
      to: [toX, toY],
      player,
      board,
    })
  ) {
    throw new Error("Invalid move for piece");
  }

  // Check the path is clear
  console.warn("about to check path", piece);
  if (piece.type !== "N") {
    const dx = toX - fromX;
    const dy = toY - fromY;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    const stepX = dx / steps;
    const stepY = dy / steps;
    for (let i = 1; i < steps; i++) {
      const [x, y] = [fromX + i * stepX, fromY + i * stepY];
      if (board[x][y]) {
        throw new Error("Path is not clear");
      }
    }
  }
  return true;
}

function generateFen(board: BoardState): string {
  let fen = "";
  // Start from the last row (row 7 in 0-indexed array, which corresponds to the 8th rank in chess)
  for (let y = 7; y >= 0; y--) {
    let emptySquares = 0;
    for (let x = 0; x < 8; x++) {
      const piece = board[x][y];
      if (piece === null) {
        emptySquares++;
      } else {
        if (emptySquares > 0) {
          fen += emptySquares.toString();
          emptySquares = 0;
        }
        const pieceChar = getPieceChar(piece);
        fen +=
          piece.player === "white"
            ? pieceChar.toUpperCase()
            : pieceChar.toLowerCase();
      }
    }
    if (emptySquares > 0) {
      fen += emptySquares.toString();
    }
    if (y > 0) {
      fen += "/";
    }
  }
  // Placeholder for active color, castling availability, en passant target square, halfmove clock, and fullmove number
  fen += " w KQkq - 0 1";
  return fen;
}

function getPieceChar(piece: Piece): string {
  switch (piece.type) {
    case "P":
      return "p";
    case "N":
      return "n";
    case "B":
      return "b";
    case "R":
      return "r";
    case "Q":
      return "q";
    case "K":
      return "k";
    default:
      throw new Error("Unknown piece type");
  }
}

function getAsciiBoard(board: BoardState): string {
  const pieceToChar = {
    P: "P",
    N: "N",
    B: "B",
    R: "R",
    Q: "Q",
    K: "K",
  };

  let asciiBoard = "  +---+---+---+---+---+---+---+---+\n";
  // Start from the last row (row 7 in 0-indexed array, which corresponds to the 8th rank in chess)
  for (let y = 7; y >= 0; y--) {
    let row = `${y + 1} |`;
    for (let x = 0; x < 8; x++) {
      const piece = board[x][y];
      const pieceChar = piece
        ? piece.player === "white"
          ? pieceToChar[piece.type]
          : pieceToChar[piece.type].toLowerCase()
        : " ";
      row += ` ${pieceChar} |`;
    }
    asciiBoard += row + "\n";
    asciiBoard += "  +---+---+---+---+---+---+---+---+\n";
  }
  asciiBoard += "    a   b   c   d   e   f   g   h  \n";
  return asciiBoard;
}

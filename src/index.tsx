import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";

const range = (length: number) => [...Array(length)].map((_, i) => i);

interface Location {
  row: number;
  col: number;
}
const ROW_LENGTH = 3;
const COL_LENGTH = 3;
const calcIndex = ({ row, col }: Location) => row * ROW_LENGTH + col;

const calculateWinner = (
  squares: ReadonlyArray<string | null>
): { winner: string; causedSquares: number[] } | null => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    const cur = squares[a];
    if (cur && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: cur, causedSquares: lines[i] };
    }
  }
  return null;
};
const isDraw = (squares: ReadonlyArray<string | null>): boolean =>
  !squares.includes(null);

const calcCurrentMoveLocation = (
  prevSquares: ReadonlyArray<string | null>,
  curSquares: ReadonlyArray<string | null>
): Location => {
  for (let r = 0; r < ROW_LENGTH; r++) {
    for (let c = 0; c < COL_LENGTH; c++) {
      const curIndex = calcIndex({ row: r, col: c });
      if (prevSquares[curIndex] !== curSquares[curIndex])
        return { row: r, col: c };
    }
  }
  // ここには来ないので
  throw Error();
};
const toString = (value: Location) => `(${value.row}, ${value.col})`;

interface SquareProps {
  value: string | null;
  onClick: () => void;
  winCause: boolean;
}
const Square: React.FC<SquareProps> = (props: SquareProps) => {
  return (
    <button
      className={`square${props.winCause ? " win" : ""}`}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
};

interface BoardProps {
  squares: ReadonlyArray<string | null>;
  onClick: (i: number) => void;
  winCauseSquares?: ReadonlyArray<number>;
}
const Board: React.FC<BoardProps> = (props: BoardProps) => {
  const renderSquare = (i: number, winCause: boolean) => (
    <Square
      value={props.squares[i]}
      onClick={() => props.onClick(i)}
      winCause={winCause}
    />
  );

  return (
    <div>
      {range(ROW_LENGTH).map((r) => (
        <div className="board-row" key={r}>
          {range(COL_LENGTH).map((c) => (
            <React.Fragment key={c}>
              {renderSquare(
                calcIndex({ row: r, col: c }),
                props.winCauseSquares?.includes(
                  calcIndex({ row: r, col: c })
                ) ?? false
              )}
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );
};

const Game: React.FC = () => {
  const [history, setHistory] = useState([
    { squares: Array<string | null>(ROW_LENGTH * COL_LENGTH).fill(null) },
  ]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [orderAsc, setOrderAsc] = useState(true);

  const currentPlayer = xIsNext ? "X" : "O";
  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);
  const status = winner
    ? `Winner: ${winner.winner}`
    : isDraw(current.squares)
    ? "Draw"
    : `Next player: ${currentPlayer}`;

  const jumpTo = (step: number) => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  };
  const moves = history.map((step, move) => {
    const prevHistory = history[move - 1];
    const desc = move
      ? `Go to move #${move} location: ${toString(
          calcCurrentMoveLocation(prevHistory.squares, step.squares)
        )}`
      : "Go to game start";

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>
          {move === stepNumber ? <b>{desc}</b> : desc}
        </button>
      </li>
    );
  });

  const handleClick = (i: number) => {
    const targetHistory = history.slice(0, stepNumber + 1);
    const targetCurrent = targetHistory[targetHistory.length - 1];
    const newSquares = targetCurrent.squares.slice();
    if (calculateWinner(newSquares) || newSquares[i]) {
      return;
    }

    newSquares[i] = currentPlayer;
    setHistory(targetHistory.concat([{ squares: newSquares }]));
    setStepNumber(targetHistory.length);
    setXIsNext((x) => !x);
  };

  const handleOrderClick = () => {
    setOrderAsc((x) => !x);
  };

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          onClick={(i) => handleClick(i)}
          winCauseSquares={winner?.causedSquares}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <div>
          <button onClick={handleOrderClick}>{orderAsc ? "⇧" : "⇩"}</button>
        </div>
        <ol>{orderAsc ? moves : moves.reverse()}</ol>
      </div>
    </div>
  );
};

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

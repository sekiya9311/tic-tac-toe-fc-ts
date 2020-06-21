import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";

const calculateWinner = (
  squares: ReadonlyArray<string | null>
): string | null => {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

interface SquareProps {
  value: string | null;
  onClick: () => void;
}
const Square: React.FC<SquareProps> = (props: SquareProps) => {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
};

interface BoardProps {
  squares: ReadonlyArray<string | null>;
  onClick: (i: number) => void;
}
const Board: React.FC<BoardProps> = (props: BoardProps) => {
  const renderSquare = (i: number) => (
    <Square value={props.squares[i]} onClick={() => props.onClick(i)} />
  );

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
};

const Game: React.FC = () => {
  const [history, setHistory] = useState([
    { squares: Array<string | null>(9).fill(null) },
  ]);
  const [xIsNext, setXIsNext] = useState(true);

  const currentPlayer = xIsNext ? "X" : "O";
  const current = history[history.length - 1];
  const winner = calculateWinner(current.squares);
  const status = winner ? `Winner: ${winner}` : `Next player: ${currentPlayer}`;

  const handleClick = (i: number) => {
    const newSquares = current.squares.slice();
    if (calculateWinner(newSquares) || newSquares[i]) {
      return;
    }
    newSquares[i] = currentPlayer;
    setHistory((curHistory) => curHistory.concat([{ squares: newSquares }]));
    setXIsNext((x) => !x);
  };

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={current.squares} onClick={(i) => handleClick(i)} />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{/* TODO */}</ol>
      </div>
    </div>
  );
};

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

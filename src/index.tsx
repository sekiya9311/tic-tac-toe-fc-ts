import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";

interface SquareProps {
  value: number;
}
const Square: React.FC<SquareProps> = (props: SquareProps) => {
  const [value, setValue] = useState<string | null>(null);
  return (
    <button className="square" onClick={() => setValue("X")}>
      {value}
    </button>
  );
};

const Board: React.FC = () => {
  const renderSquare = (i: number) => <Square value={i} />;

  const status = "Next player: X";

  return (
    <div>
      <div className="status">{status}</div>
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
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
      <div className="game-info">
        <div>{/* status */}</div>
        <ol>{/* TODO */}</ol>
      </div>
    </div>
  );
};

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

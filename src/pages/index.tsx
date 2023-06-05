import { type NextPage } from "next";
import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";

type PlayerType = "X" | "O";
type GameWinner = PlayerType | "tie" | null;

const Home: NextPage = () => {
  const [board, setBoard] = useState<PlayerType[]>(new Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<PlayerType>("X");
  const [gameWinner, setGameWinner] = useState<GameWinner>(null);

  checkGameWinner(board);

  function checkGameWinner(board: PlayerType[]) {
    if (gameWinner !== null) {
      return;
    }

    const winningCombinations: [number, number, number][] = [
      // Horizontal
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      // Vertical
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      // Diagonal
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        setGameWinner(board[a]!);
      }
    }

    if (board.every((cell) => cell !== null)) {
      setGameWinner("tie");
    }
  }

  const toggleCurrentPlayer = () => {
    const newCurrentPlayer: PlayerType = currentPlayer === "X" ? "O" : "X";
    setCurrentPlayer(newCurrentPlayer);
  };

  const handleClick = (cellIndex: number) => {
    setBoard((board) =>
      board.map((cell, index) => {
        if (index === cellIndex && cell === null) {
          return currentPlayer;
        }
        return cell;
      })
    );
    toggleCurrentPlayer();
  };

  return (
    <>
      Current Player: {currentPlayer}
      {showGameResult(gameWinner)}
      <div className="flex flex-wrap">
        {board.map((cell, index) => {
          return (
            <Cell
              hasGameEnded={gameWinner !== null}
              onClick={handleClick}
              value={cell}
              index={index}
              key={index}
            />
          );
        })}
      </div>
    </>
  );
};

const Cell: React.FC<{
  onClick: (cellIndex: number) => void;
  value: PlayerType;
  index: number;
  hasGameEnded: boolean;
}> = ({ onClick, value, index, hasGameEnded }) => {
  return (
    <button
      className="basis-[33%] border-2 border-black p-4"
      disabled={hasGameEnded}
      onClick={() => onClick(index)}
    >
      {value}
    </button>
  );
};

function showGameResult(gameWinner: GameWinner) {
  if (gameWinner === "tie") {
    return "It's a Tie!";
  }

  if (gameWinner !== null) {
    return `Winner: ${gameWinner}`;
  }

  return null;
}

export default Home;

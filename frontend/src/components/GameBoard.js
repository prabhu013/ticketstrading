import React, { useState, useEffect } from 'react';
import Tile from './Tile';
import { toast } from 'react-toastify';
import axios from 'axios';
import MineGameModal from './MineGameModal';

const GameBoard = ({ bombCount, initialBet, onTryAgain , onHome}) => {
  const [tiles, setTiles] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameEnd, setGameEnd] = useState(false);
  const [winnings, setWinnings] = useState(0);
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const [showModal, setShowModal] = useState(false);

  let arr = Array.from({ length: 25 }, () => Array(25).fill(null));


  arr[1][1] = 1.01;arr[1][2] = 1.08;arr[1][3] = 1.12;arr[1][4] = 1.18;arr[1][5] = 1.24;arr[1][6] = 1.30;arr[1][7] = 1.37;arr[1][8] = 1.46;arr[1][9] = 1.55;arr[1][10] = 1.65;arr[1][11] = 1.77;arr[1][12] = 1.90;arr[1][13] = 2.06;arr[1][14] = 2.25;arr[1][15] = 2.47;arr[1][16] = 2.75;arr[1][17] = 3.09;arr[1][18] = 3.54;arr[1][19] = 4.12;arr[1][20] = 4.95;arr[1][21] = 6.19;arr[1][22] = 8.25;arr[1][23] = 12.38;arr[1][24] = 24.75;
  arr[2][1] = 1.08; arr[2][2] = 1.17; arr[2][3] = 1.29; arr[2][4] = 1.41; arr[2][5] = 1.56; arr[2][6] = 1.74; arr[2][7] = 1.94; arr[2][8] = 2.18; arr[2][9] = 2.47; arr[2][10] = 2.83; arr[2][11] = 3.26; arr[2][12] = 3.81; arr[2][13] = 4.50; arr[2][14] = 5.40; arr[2][15] = 6.60; arr[2][16] = 8.25; arr[2][17] = 10.61; arr[2][18] = 14.14; arr[2][19] = 19.8; arr[2][20] = 29.70; arr[2][21] = 49.50; arr[2][22] = 99; arr[2][23] = 297; 
  arr[3][1] = 1.12; arr[3][2] = 1.29; arr[3][3] = 1.48; arr[3][4] = 1.71; arr[3][5] = 2.00; arr[3][6] = 2.35; arr[3][7] = 2.79; arr[3][8] = 3.35; arr[3][9] = 4.07; arr[3][10] = 5.00; arr[3][11] = 6.26; arr[3][12] = 7.96; arr[3][13] = 10.35; arr[3][14] = 13.80; arr[3][15] = 18.97; arr[3][16] = 27.11; arr[3][17] = 40.66; arr[3][18] = 65.06; arr[3][19] = 113.85; arr[3][20] = 227.70; arr[3][21] = 569.25; arr[3][22] = 2277;
  arr[4][1] = 1.18; arr[4][2] = 1.41; arr[4][3] = 1.71; arr[4][4] = 2.09; arr[4][5] = 2.58; arr[4][6] = 3.23; arr[4][7] = 4.09; arr[4][8] = 5.26; arr[4][9] = 6.88; arr[4][10] = 9.17; arr[4][11] = 12.51; arr[4][12] = 17.52; arr[4][13] = 25.30; arr[4][14] = 37.95; arr[4][15] = 59.64; arr[4][16] = 99.39; arr[4][17] = 178.91; arr[4][18] = 357.81; arr[4][19] = 834.90; arr[4][20] = 2504; arr[4][21] = 12523;
  arr[5][1] = 1.24; arr[5][2] = 1.56; arr[5][3] = 2; arr[5][4] = 2.58; arr[5][5] = 3.39; arr[5][6] = 4.52; arr[5][7] = 6.14; arr[5][8] = 8.50; arr[5][9] = 12.04; arr[5][10] = 17.52; arr[5][11] = 26.27; arr[5][12] = 40.87; arr[5][13] = 66.41; arr[5][14] = 113.85; arr[5][15] = 208.72; arr[5][16] = 417.45; arr[5][17] = 939.26; arr[5][18] = 2504; arr[5][19] = 8766; arr[5][20] = 52598;
  arr[6][1] = 1.30; arr[6][2] = 1.74; arr[6][3] = 2.35; arr[6][4] = 3.23; arr[6][5] = 4.52; arr[6][6] = 6.46; arr[6][7] = 9.44; arr[6][8] = 14.17; arr[6][9] = 21.89; arr[6][10] = 35.03; arr[6][11] = 58.38; arr[6][12] = 102.17; arr[6][13] = 189.75; arr[6][14] = 379.5; arr[6][15] = 834.90; arr[6][16] = 2087; arr[6][17] = 6261; arr[6][18] = 25047; arr[6][19] = 175329;
  arr[7][1] = 1.37; arr[7][2] = 1.94; arr[7][3] = 2.79; arr[7][4] = 4.09; arr[7][5] = 6.14; arr[7][6] = 9.44; arr[7][7] = 14.95; arr[7][8] = 24.47; arr[7][9] = 41.60; arr[7][10] = 73.95; arr[7][11] = 138.66; arr[7][12] = 277.33; arr[7][13] = 600.87; arr[7][14] = 1442; arr[7][15] = 3965; arr[7][16] = 13219; arr[7][17] = 59486; arr[7][18] = 475893;
  arr[8][1] = 1.46; arr[8][2] = 2.18; arr[8][3] = 3.35; arr[8][4] = 5.26; arr[8][5] = 8.5; arr[8][6] = 14.17; arr[8][7] = 24.47; arr[8][8] = 44.05; arr[8][9] = 83.2; arr[8][10] = 166.4; arr[8][11] = 356.56; arr[8][12] = 831.98; arr[8][13] = 2163; arr[8][14] = 6489; arr[8][15] = 23794; arr[8][16] = 118973; arr[8][17] = 1070759;
  arr[9][1] = 1.55; arr[9][2] = 2.47; arr[9][3] = 4.07; arr[9][4] = 6.88; arr[9][5] = 12.04; arr[9][6] = 21.89; arr[9][7] = 41.60; arr[9][8] = 83.20; arr[9][9] = 176.80; arr[9][10] = 404.10; arr[9][11] = 1010; arr[9][12] = 2828; arr[9][13] = 9193; arr[9][14] = 36773; arr[9][15] = 202254; arr[9][16] = 2022545;
  arr[10][1] = 1.65; arr[10][2] = 2.83; arr[10][3] = 5; arr[10][4] = 9.17; arr[10][5] = 17.52; arr[10][6] = 35.03; arr[10][7] = 73.95; arr[10][8] = 166.40; arr[10][9] = 404.10; arr[10][10] = 1077; arr[10][11] = 3232; arr[10][12] = 11314; arr[10][13] = 49031; arr[10][14] = 294188; arr[10][15] = 3236072;
  arr[11][1] = 1.77; arr[11][2] = 3.26; arr[11][3] = 6.26; arr[11][4] = 12.51; arr[11][5] = 26.77; arr[11][6] = 58.38; arr[11][7] = 138.66; arr[11][8] = 356.56; arr[11][9] = 1010; arr[11][10] = 3232; arr[11][11] = 12123; arr[11][12] = 56574; arr[11][13] = 367735; arr[11][14] = 4412826;
  arr[12][1] = 1.90; arr[12][2] = 3.81; arr[12][3] = 7.96; arr[12][4] = 17.52; arr[12][5] = 40.87; arr[12][6] = 102.17; arr[12][7] = 277.33; arr[12][8] = 831.98; arr[12][9] = 2828; arr[12][10] = 11314; arr[12][11] = 56574; arr[12][12] = 396022; arr[12][13] = 5148297;
  arr[13][1] = 2.06; arr[13][2] = 4.50; arr[13][3] = 10.35; arr[13][4] = 25.30; arr[13][5] = 66.41; arr[13][6] = 189.75; arr[13][7] = 600.87; arr[13][8] = 2163; arr[13][9] = 9193; arr[13][10] = 49031; arr[13][11] = 367735; arr[13][12] = 5148297;
  arr[14][1] = 2.25; arr[14][2] = 5.4; arr[14][3] = 13.8; arr[14][4] = 37.95; arr[14][5] = 113.85; arr[14][6] = 379.5; arr[14][7] = 1442; arr[14][8] = 6489; arr[14][9] = 36773; arr[14][10] = 294188; arr[14][11] = 4412826;
  arr[15][1] = 2.47; arr[15][2] = 6.6; arr[15][3] = 18.97; arr[15][4] = 59.64; arr[15][5] = 208.72; arr[15][6] = 834.9; arr[15][7] = 3965; arr[15][8] = 23794; arr[15][9] = 202254; arr[15][10] = 3236072;
  arr[16][1] = 2.75; arr[16][2] = 8.25; arr[16][3] = 27.11; arr[16][4] = 99.39; arr[16][5] = 417.45; arr[16][6] = 2087; arr[16][7] = 13219; arr[16][8] = 118973; arr[16][9] = 2022545;
  arr[17][1] = 3.09; arr[17][2] = 10.61; arr[17][3] = 40.66; arr[17][4] = 178.91; arr[17][5] = 939.26; arr[17][6] = 6261; arr[17][7] = 59486; arr[17][8] = 1070759;
  arr[18][1] = 3.54; arr[18][2] = 14.14; arr[18][3] = 65.06; arr[18][4] = 357.81; arr[18][5] = 2504; arr[18][6] = 25047; arr[18][7] = 475893;
  arr[19][1] = 4.12; arr[19][2] = 19.80; arr[19][3] = 113.85; arr[19][4] = 834.9; arr[19][5] = 8766; arr[19][6] = 175329;
  arr[20][1] = 4.95; arr[20][2] = 29.7; arr[20][3] = 227.7; arr[20][4] = 2504; arr[20][5] = 52598;
  arr[21][1] = 6.19; arr[21][2] = 49.5; arr[21][3] = 569.25; arr[21][4] = 12523;
  arr[22][1] = 8.25; arr[22][2] = 99; arr[22][3] = 2277;
  arr[23][1] = 12.37; arr[23][2] = 297;
  arr[24][1] = 24.7;


  useEffect(() => {

    const newTiles = Array(25).fill({ isRevealed: false, isBomb: false, isClicked: false });


    const bombPositions = new Set();
    while (bombPositions.size < bombCount) {
      const position = Math.floor(Math.random() * 25);
      bombPositions.add(position);
    }

    bombPositions.forEach(position => {
      newTiles[position] = { ...newTiles[position], isBomb: true };
    });

    setTiles(newTiles);
    setGameOver(false);
    setGameEnd(false);
    setWinnings(0);
    setCount(0);
    setShowModal(false);  
  }, [bombCount]);

  const handleCashout = async () => {
    const response = await axios.post("https://ticket-trading.onrender.com/payment/gamesell", { userid: localStorage.getItem("uniqueid"), sellvalue: Math.round(winnings*10)/10 });


    if (response.data.success) {
      const updateTiles = tiles.map((tile) => {
        tile.isRevealed = true
        return tile
      });

      setTiles(updateTiles);
      setGameEnd(true);
      
      setDone(true);
    }
    else {
      toast.error("Something went wrong, try again", {
        position: "top-right",
      })
      return;
    }

  }

  const handleClick = (index) => {
    if (gameEnd || gameOver || tiles[index].isRevealed) return;

    const newTiles = tiles.map((tile, i) => {
      if (i === index) {
        return { ...tile, isRevealed: true, isClicked: true };
      }
      return tile;
    });

    setTiles(newTiles);

    if (newTiles[index].isBomb) {

      const updateTiles = tiles.map((tile) => {
        tile.isRevealed = true
        return tile
      });


      setTiles(updateTiles);
      setGameOver(true);
      setWinnings(0);
      setShowModal(true); 
      
    } else {
      setCount(count + 1);
      setShowModal(true);
      setWinnings(Math.round(initialBet*arr[bombCount][count+1]*10)/10);
    }
  }; 

  return (
    <div>
      <div className="game-board">
        {tiles.map((tile, index) => (
          <Tile
            key={index}
            isRevealed={tile.isRevealed}
            isBomb={tile.isBomb}
            isClicked={tile.isClicked}
            onClick={() => handleClick(index)}
          />
        ))}
      </div>
      
      <MineGameModal
        show={showModal} 
        isGameOver={gameOver}
        isDone = {done} 
        winnings={winnings} 
        onTryAgain={onTryAgain} 
        onHome={onHome}
        onCashout={handleCashout}
      />
    </div>
  );
};

export default GameBoard;

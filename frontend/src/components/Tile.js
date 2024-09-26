import React from 'react';
import '../CSS/Tile.css';

const Tile = ({ isRevealed, isBomb, onClick , isClicked}) => {
  let content = '';
  if (isRevealed) {
    content = isBomb ? '💣' : '💎';
  }

 

  return (
    <>
    {
      isClicked ? 
      <div className="tile" style={{backgroundColor:'white'}} onClick={onClick}>
      {content}
    </div>
    :
    <div className="tile" onClick={onClick}>
      {content}
    </div>
    }
    </>
  );
};

export default Tile;
import React from 'react';
import '../CSS/MineGame.css';

const MineGameModal = ({ show, isGameOver, isDone, winnings, onTryAgain, onHome , onCashout}) => {
    if (!show) return null;

    return (
        <div className={`popup ${isGameOver ? 'loss' : 'win'}`}>
            <h2>{isGameOver ? 'Game Over' : <>{isDone ? 'Congratulations!' : ''} </>}</h2>
            <p>{isGameOver ? 'You hit a bomb!' : `Total Winnings: ₹${winnings}`}</p>
            <>
                {isGameOver ?
                    <div>
                        <button onClick={onHome}>Home</button>
                        <button onClick={onTryAgain}>Try Again</button>
                    </div>
                    :
                    <div>
                        {isDone ?
                            <div>
                                <button onClick={onHome}>Home</button>
                                <button onClick={onTryAgain}>Try Again</button>
                            </div>
                            :
                            <div>
                                <button onClick={onCashout}>Cashout</button>
                            </div>
                        }
                    </div>
                }
            </>
        </div>
    );
};
 
export default MineGameModal;

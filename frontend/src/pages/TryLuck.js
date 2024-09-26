import React, { useState } from 'react';
import GameBoard from '../components/GameBoard';
import '../CSS/LuckGame.css';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

export default function TryLuck() {

  const [bombCount, setBombCount] = useState(5);
  const [initialBet, setInitialBet] = useState(10);
  const [check, setCheck] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!localStorage.getItem("authToken") || !localStorage.getItem('uniqueid')) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("uniqueid");
      navigate('/signup')
      return

    }



    const responseauth = await fetch("https://ticket-trading.onrender.com/api/auth", {
      method: 'Post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: localStorage.getItem('authToken') })
    });

    const jsonauth = await responseauth.json();

    if (!jsonauth.status) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("uniqueid");
      navigate('/signup')
      return
    }
    if (bombCount < 1 || bombCount > 24) {
      toast.error("Bombs : 1 to 24", {
        position: "top-right",
      })
      return;
    }

    const cash = await axios.post("https://ticket-trading.onrender.com/api/userdata", { userid: localStorage.getItem("uniqueid") });

    if (cash.data.user.money < initialBet) {
      toast.error("Not Enough Balance", {
        position: "top-right",
      })
      return;
    }

    const response = await axios.post("https://ticket-trading.onrender.com/payment/gamebuy", { userid: localStorage.getItem("uniqueid"), buyvalue: Math.round(initialBet * 10) / 10 });

    if (response.data.success) {
      setCheck(true);
      navigate('/tryluck')
    }
    else {
      toast.error("Something went wrong, try again", {
        position: "top-right",
      })
      return;
    }
  }

  const handleTryAgain = () => {
    setCheck(false);
    window.location.reload(false);
  }

  const handleHome = () => {
    setCheck(false);
    navigate('/');
  }
  
  return (
    <div>
      <Navbar />
      <div className="App">

        <h1>Mines Game</h1>

        {
          check ?
            <>
              <div className="settings" style={{ cursor: 'not-allowed' }}>
                <label style={{ cursor: 'not-allowed' }} readonly>
                  <div>
                    Bombs: {bombCount}
                  </div>

                </label>
                <label style={{ cursor: 'not-allowed' }} readonly>

                  <div>
                    Bet Amount: ₹{initialBet}
                  </div>
                </label>
              </div>
              <GameBoard bombCount={bombCount} initialBet={initialBet} onTryAgain={handleTryAgain} onHome={handleHome} />

            </>
            :
            <div className="settings">
              <label>
                Bombs:
                <input
                  type="number"
                  min="1" max="24"
                  step="1"
                  value={bombCount}
                  onChange={(e) => {
                    setBombCount(parseInt(e.target.value))

                  }}
                />
              </label>
              <label>
                Bet Amount: ₹
                <input
                  type="number"
                  value={initialBet}
                  onChange={(e) => setInitialBet(parseInt(e.target.value))}
                />
              </label>
              <label onClick={handleSubmit} style={{ cursor: 'pointer' }}>
                Submit
              </label>
            </div>
        }
        <ToastContainer />
      </div>
      <div className="footer-copyright">
        Created By<br /> - Pranav
      </div>
    </div>
  )
}

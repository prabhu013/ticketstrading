
import axios from 'axios';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export default function QuestionBox({ id, question, yesPrice, noPrice, total, updatedAt}) {
 

  const [showSlider, setShowSlider] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [sliderValue, setSliderValue] = useState(1);

  const navigate = useNavigate();

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setShowSlider(true);
    if(option === 'No')
    setSliderValue(noPrice);
  else
  setSliderValue(yesPrice);
  };

  const handleSliderChange = (e) => {
    setSliderValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!localStorage.getItem('authToken')) {
      navigate('/signup');
      return;
    }
    
    const cash = await axios.post("https://ticket-trading.onrender.com/api/userdata", { userid: localStorage.getItem("uniqueid") });

    if (cash.data.user.money < sliderValue) {
      toast.error("Not Enough Money", { position: "top-right" })
      return;
    }

    const response = await fetch("https://ticket-trading.onrender.com/check/request", {
      method: 'Post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question: question, userid: localStorage.getItem("uniqueid"), questionid: id, value: sliderValue, ans: selectedOption, chk: '1' })
    });

    const json = await response.json();
  
    if (!json.success) {
      toast.error(`Order not placed`, {
        position: "top-right"
      })
    }
    if (json.success) {
      if (json.status === "1") {
        toast(`Congrats, Order Proceed`, {
          position: "top-right"
        })
        setTimeout(() => {
          navigate("/myorder")
        }, 1500)
      }
      else {
        toast.success(`Order Placed`, {
          position: "top-right"
        })
        setTimeout(() => {
          navigate("/myrequest")
        }, 1500)
      }


    }
  
  
  };

  return (
    <>
      <div style={{ backgroundColor: 'white', display: 'block', width: '500px', border: '2px solid black', padding: '10px', marginBottom: '20px' }}>
        <div style={{

          top: '10px',
          textAlign: 'end',
          padding: '5px'


        }}>
          Total : <span style={{ fontWeight: 'bold' }}>{total}</span>
        </div>
        <div style={{

          top: '10px',
          textAlign: 'end',
          padding: '5px'


        }}>
          Last Updated : <span style={{ fontWeight: 'bold' }}>{format(new Date(updatedAt), 'HH:mm, dd/MM/yy')}</span>
        </div>
        <div style={{ borderBottom: '1px solid black', textAlign: 'center', height: '68px' , marginBottom:'5px'}}>
          <h3>{question}</h3>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          <div style={{ width: '250px', display: 'block', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ backgroundColor: 'green', color: 'white', padding: '5px', marginRight: '10px', cursor: 'pointer' }} onClick={() => handleOptionClick('Yes')}>Yes | {yesPrice}</div>

          </div>
          <div style={{ width: '250px', display: 'block', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ backgroundColor: 'red', color: 'white', padding: '5px', cursor: 'pointer' }} onClick={() => handleOptionClick('No')}>No | {noPrice}</div>

          </div>
        </div>

        {showSlider && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
              Selected Option: {selectedOption === 'Yes'
                ?
                <span style={{ color: 'green' }} >
                  Yes
                </span>
                :
                <span style={{ color: 'red' }}>
                  No
                </span>
              }
            </div>
            <input
              type="range"
              min="1"
              max="9"
              value={sliderValue}
              onChange={handleSliderChange}
              style={{ width: '100%', cursor: 'pointer' }}
            />
            <div>Selected Value: {sliderValue}</div>
            <button
              onClick={handleSubmit}
              style={{ marginTop: '10px', padding: '10px', backgroundColor: 'blue', color: 'white', borderRadius: '5px', cursor: 'pointer' }}
            >
              Submit
            </button>
            <button
              onClick={() => { setShowSlider(false); }}
              style={{ marginLeft: '10px', marginTop: '10px', padding: '10px', backgroundColor: 'red', color: 'white', borderRadius: '5px', cursor: 'pointer' }}
            >
              Close
            </button>
          </div>
        )}


      </div>

    </>


  )
}
 
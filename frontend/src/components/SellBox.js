
import { format } from 'date-fns';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SellBox({ val , valque}) {

  const [sliderValue, setSliderValue] = useState(1);
  const [showSlider, setShowSlider] = useState(false);

  const navigate = useNavigate();

  
const netvalue = (val.ans === 'Yes' ? (valque.yes - val.value) : (valque.no - val.value)) >=0

  const handleSliderChange = (e) => { 
    setSliderValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("https://ticket-trading.onrender.com/check/request", {
      method: 'Post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ orderid: val._id, question: val.question, userid: localStorage.getItem("uniqueid"), questionid: val.questionid, value: sliderValue, ans: val.ans, chk: '2', originalvalue: val.value })
    });

    const json = await response.json();

    if (!json.success)
      toast.error("Error Selling Order",{position : "top-right"})
    if (json.success) {
      if (json.status === "1") {
        toast("Congrats, Order Sell!",{position : "top-right"})
        setTimeout(()=>{navigate("/mysell")},1500)
      }
      else {
        toast.success("Selling Placed",{position : "top-right"})
        setTimeout(()=>{navigate("/myrequest")},1500)
      }


    }
  };

  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("https://ticket-trading.onrender.com/check/cancelrequest", {
      method: 'Post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ orderid: val._id})
    });

    const json = await response.json();

    if (!json.success)
    {
      toast.error("Error Cancelling Order",{position : "top-right"})
    }
    if (json.success) {
      toast.success("Selling Cancelled",{position : "top-right"})
      setTimeout(()=>{navigate("/myrequest")},1500)

    }
  };


  return (
    <div style={{ backgroundColor:'white',width: '100%', border: '2px solid black', padding: '10px', marginBottom: '20px' }}>
<div style={{ 
        
        top: '10px', 
       textAlign : 'end', 
        padding: '5px'
       
        
      }}>
       Placed On : <span style={{fontWeight:'bold'}}>{format(new Date(val.updatedAt), 'HH:mm, dd/MM/yy')}</span>
       
      </div>
      <div style={{ borderBottom: '1px solid black', paddingBottom: '10px', textAlign: 'center' }}>
        <h3>{val.question}</h3>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <div style={{ width:'80px',display: 'block', alignItems: 'center', textAlign: 'center', marginRight: '20px' }}>
          <h5>Order :</h5>
        </div>
        <div style={{ width: '150px', display: 'block', alignItems: 'center', textAlign: 'center' }}>
          {val.ans === 'Yes' ?
            <div style={{ backgroundColor: 'green', color: 'white', padding: '5px', alignItems: 'center', cursor:'pointer' }} onClick={() => { setShowSlider(true); setSliderValue(val.value) }} >{val.ans} at {val.value}</div>
            :
            <div style={{ backgroundColor: 'red', color: 'white', padding: '5px', alignItems: 'center' , cursor:'pointer'}} onClick={() => { setShowSlider(true); setSliderValue(val.value) }}> {val.ans} at {val.value}</div>
          }
        </div>
        <div style={{ width: '150px', display: 'block', alignItems: 'center', textAlign: 'center',marginLeft:'20px' }}>
          {val.ans === 'Yes' ?
          <>
          {netvalue ? 
            <div style={{ border: '1px solid green',backgroundColor: 'white', color: 'green', padding: '5px', alignItems: 'center', cursor:'pointer' }} onClick={() => { setShowSlider(true); setSliderValue(val.value) }} >Profit : +{valque.yes - val.value}</div>
            :
            <div style={{ border: '1px solid red',backgroundColor: 'white', color: 'red', padding: '5px', alignItems: 'center', cursor:'pointer' }} onClick={() => { setShowSlider(true); setSliderValue(val.value) }} >Loss : {valque.yes - val.value}</div>
          }
            </>
            :
            <>
            {netvalue ? 
            <div style={{border: '1px solid green', backgroundColor: 'white', color: 'green', padding: '5px', alignItems: 'center' , cursor:'pointer'}} onClick={() => { setShowSlider(true); setSliderValue(val.value) }}>Profit : +{valque.no - val.value}</div>
            :
            <div style={{border: '1px solid red', backgroundColor: 'white', color: 'red', padding: '5px', alignItems: 'center' , cursor:'pointer'}} onClick={() => { setShowSlider(true); setSliderValue(val.value) }}>Loss : {valque.no - val.value}</div>
           
}
            </>
          }
        </div>
      </div>
      {val.sellvalue ?
      
        <div style={{ display: 'flex', marginTop: '10px' }}>
          <div style={{ width:'90px',display: 'block', alignItems: 'center', textAlign: 'center', marginRight: '10px' }}>
            <h5>Selling :</h5>
          </div>
          <div style={{ width: '150px', display: 'block', alignItems: 'center', textAlign: 'center' }}>
            {val.sellvalue - val.value >= '0' 
            ?
              <div style={{border: '1px solid green', backgroundColor: 'white', color: 'green', padding: '5px', alignItems: 'center' }}  >At {val.sellvalue}</div>

              :
              <div style={{border: '1px solid red', backgroundColor: 'white', color: 'red', padding: '5px', alignItems: 'center' }}  >At {val.sellvalue}</div>
            }
          </div>
          <button
                onClick={handleCancelSubmit}
                style={{width:'150px' ,height:'34px',textAlign: 'center',alignItems:'center', padding: '5px', backgroundColor: 'yellow', color: 'black', borderRadius: '5px', cursor: 'pointer',marginLeft:'20px' }}
              >
                Cancel
              </button>
        </div>
    
        :
        <div>
          {showSlider && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                Selling : {val.ans === 'Yes'
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
                style={{ width: '100%',cursor:'pointer' }}
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
          )
          }
        </div>
      }

    </div>
  )
}
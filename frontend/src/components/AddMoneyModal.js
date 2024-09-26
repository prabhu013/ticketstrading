import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
`;

const Input = styled.input`
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: calc(100% - 1rem);
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-right: 0.5rem;

  &:hover {
    background-color: #0056b3;
  }
`;

const AddMoneyModal = ({ onClose }) => {
  const [money, setMoney] = useState('');
const navigate = useNavigate();

const loadScript = src => new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      console.log('razorpay loaded successfully');
      resolve(true);
    };
    script.onerror = () => {
      console.log('error in loading razorpay');
      resolve(false);
    };
    document.body.appendChild(script);
  });
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await loadScript(
        'https://checkout.razorpay.com/v1/checkout.js',
      );
  
      if (!res) {
        console.log('Razorpay SDK failed to load. Are you online?');
        return;
      }
  
      const response = await fetch("https://ticket-trading.onrender.com/payment/check", {
        method: 'Post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: money })
      });
  
      const data = await response.json();
  
      if (data.success) {
        var options = {
          "key": data.key_id, 
          "amount": data.amount, 
          "currency": "INR",
          "name": "Gamble",
          "description": "Test Transaction",
          "image": "https://picsum.photos/200/300",
          "order_id": data.order_id, 
          "handler": async function (response) {
            const authdata = {
              orderCreationId: data.order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              netamount: data.amount,
              userid: localStorage.getItem("uniqueid")
            };
  
            const result = await axios.post("https://ticket-trading.onrender.com/payment/success", authdata);
  
            if (result.data.success) {
              navigate("/mytransaction")
            }
            else {
              alert("Payment Failed")
            }
  
          },
          "prefill": {
            "name": "Gaurav Kumar",
            "email": "gaurav.kumar@example.com",
            "contact": "9000090000"
          },
          "notes": {
            "address": "Razorpay Corporate Office"
          },
          "timeout": 300,
          "retry": {
            enabled: false,
          },
          "theme": {
            "color": "#3399cc"
          }
        };
        var rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed',async function (response) {
            setTimeout( async () =>{
          const authdata = {
            
            razorpayPaymentId: response.error.metadata.payment_id,
            netamount: data.amount,
            userid: localStorage.getItem("uniqueid")
          };
  
         const result = await axios.post("https://ticket-trading.onrender.com/payment/fail", authdata);
  
          if(result.data.success)
            navigate("/mytransaction")
          
      },6000) });
        rzp1.open();
  
      }
      else {
        console.log("error");
        alert("Please Retry");
      }
  
    
    
  };

  

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Add Money</h2>
        <form onSubmit={handleSubmit}>
          <Input
            type="number"
            value={money}
            onChange={(e) => setMoney(e.target.value)}
            placeholder="Enter amount"
          />
          <Button type="submit">Add</Button>
          <Button type="button" onClick={onClose}>Cancel</Button>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AddMoneyModal;
 
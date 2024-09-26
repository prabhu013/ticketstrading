import React, { useEffect, useState } from 'react'
import Navbar from './Navbar';

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import AddMoneyModal from '../components/AddMoneyModal';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { DNA } from 'react-loader-spinner'

const WalletContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f2f5;
`;

const Balance = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
`;

const AddMoneyButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #0056b3;
  }
`;

export default function MyWallet() {

  

 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value,setValue]=useState([]);
  const [loading,setLoading]=useState(true);
  

  const navigate = useNavigate();  
    
  const checkauth = async () => {
  if(!localStorage.getItem("authToken") || !localStorage.getItem('uniqueid'))
    {
      localStorage.removeItem("authToken");
    localStorage.removeItem("uniqueid");
    navigate('/signup')
    return 
    
    }

  

    const responseauth = await fetch("https://ticket-trading.onrender.com/api/auth",{
      method : 'Post',
      headers : {
        'Content-Type' : 'application/json'
      },
      body:JSON.stringify({token : localStorage.getItem('authToken')})
    });

    const jsonauth = await responseauth.json();
    
  if(!jsonauth.status)
  {
    localStorage.removeItem("authToken");
    localStorage.removeItem("uniqueid");
    navigate('/signup')
    return
  }

  try {
  const response =  await axios.post("https://ticket-trading.onrender.com/api/userdata",{userid : localStorage.getItem("uniqueid")});
  
  setValue(response.data.user)
  }
  catch {
    toast.error("Failed to load data.",{position: "top-right"});
  }
  finally {
    setTimeout(()=>{
      setLoading(false);
    },1000)
  }
}  

useEffect(() => {
  checkauth();
  // eslint-disable-next-line
}, [])
  return (
    <div>
      {loading ? (
         <DNA
         visible={true}
         height="400"
         width="400"
         ariaLabel="dna-loading"
         wrapperStyle={{}}
         wrapperClass="dna-wrapper"
         />
      )
      :
      (<>
       <Navbar />
      

      <WalletContainer>
            <Balance style={{color : 'green'}}>Balance: ₹{Math.round(value.money*10)/10}</Balance>
            <AddMoneyButton onClick={() => setIsModalOpen(true)}>Add Money</AddMoneyButton>
            {isModalOpen && <AddMoneyModal onClose={() => setIsModalOpen(false)} />}
          </WalletContainer>
      </>
      )
      }
     <ToastContainer/>
    <div className="footer-copyright">
        Created By<br/> - Pranav 
      </div>
    </div>
  )
}

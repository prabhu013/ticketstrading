import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';


import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  

  

  const handlesubmit = () => {
    toast.error("User Logged Out Successfully", {
      position: "top-right",
    })
    setTimeout(() => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("uniqueid");
      navigate("/signup");
    },1000)
    
  }
const [value,setValue]=useState([]);
const loaddata = async ()=> {

  if(!localStorage.getItem('uniqueid'))
    return 
  
  const response =  await axios.post("https://ticket-trading.onrender.com/api/userdata",{userid : localStorage.getItem("uniqueid")});
  
  setValue(response.data.user)
}

useEffect(() => {
  loaddata();
  
}, [])

  return (
    <>
    <div  style={{borderBottom: '2px solid black', marginBottom: '20px' ,height:'65px',alignItems: 'center',padding:'10px', backgroundColor: '#062b39',justifyContent:'center'}}>

      <Link className="btn" style={{ fontSize:'25px',fontStyle:'bold', display: 'inline', marginLeft: '10px' }}  to="/">Ticket Trading</Link>


    

      {!localStorage.getItem("authToken")
        ?
        <>
        <div style={{ alignItems: 'center', display: 'inline' ,textAlign:'initial'}}>

          <Link className="btn " to="/login" >Login</Link>


          <Link className="btn " to="/signup" >SignUp</Link>

        </div>
        </>
        :
        <>
          <div style={{ alignItems: 'center', display: 'inline' ,textAlign:'initial'}}>
            <Link className="btn " to="/myrequest" >My Request</Link>
            <Link className="btn " to="/myorder"  >My Order</Link>
            <Link className="btn " to="/mysell" >My Sell</Link>
          <Link className="btn " to="/tryluck" >Mines Game</Link>
            <Link className="btn " to="/mywallet" >Wallet</Link>
            <Link className="btn " to="/mytransaction" >Transaction</Link>
           
            
            <Link  style={{textDecoration:'none', marginLeft:'5px'}} to="/mytransaction" ><span style={{padding:'5px',backgroundColor:'white',color : 'green', fontWeight:'bold', }}>Balance : ₹{Math.round(value.money*10)/10}</span></Link>
            <div  className='btn' >Hello, {value.name}</div>
            <div className="btn" onClick={handlesubmit} style={{backgroundColor:'red'}}>Logout</div>
          </div>
        </>
      }
    </div>
    
</>
  )




}

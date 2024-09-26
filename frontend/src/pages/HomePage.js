import React, { useEffect, useState } from 'react';
import { DNA } from 'react-loader-spinner'
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

import QuestionBox from '../components/QuestionBox';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const HomePage = () => {
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
const navigate = useNavigate();
  const loaddata = async () => {

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
    
    const restoast =  await axios.post("https://ticket-trading.onrender.com/api/userdata",{userid : localStorage.getItem("uniqueid")});
    
    try {
    let response = await fetch("https://ticket-trading.onrender.com/api/displaydata", {
      method: "POST",
      headers: {
        'Content-Type': 'Application/json'
      }
    }
    );

    let newdata = await response.json();
    setData(newdata.question);
  }
  catch (error) {
   
    toast.error("Failed to load data.",{position: "top-right"});

  } finally {
    setTimeout(()=>{
      setLoading(false);
      toast(`Hello ${restoast.data.user.name}`, {
        position: "top-right"
      })
    },1000)
    

  }
  }

  useEffect(() => {
    loaddata();
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
      ) : (
        <>
        <Navbar />
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '10px', marginLeft: '90px', marginRight: '90px', marginTop: '30px' }}>
        {data.map((val) => {
          return (
            <div key={val._id} style={{ width: '48%' }}>
              <QuestionBox 
                id={val._id} 
                question={val.question} 
                yesPrice={val.yes} 
                noPrice={val.no} 
                total={val.total} 
                updatedAt={val.updatedAt} 
                
              />
            </div>
          );
        })}
      </div>
      </>
      )}
      <ToastContainer />
      <div className="footer-copyright">
        Created By<br/> - Pranav 
      </div>
    </div>
      
  );
  
};

export default HomePage;

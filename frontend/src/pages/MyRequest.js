import React, { useEffect, useState } from 'react'
import Navbar from './Navbar';
import { DNA } from 'react-loader-spinner'
import RequestBox from '../components/RequestBox';
import { useNavigate } from 'react-router-dom';
import {toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function MyRequest() {

  const [totalrequest, setrequest] = useState([]);
const [loading,setLoading]=useState(true);


  const navigate = useNavigate();
  const loaddata = async () => {
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

    try {
    let response = await fetch("https://ticket-trading.onrender.com/check/myrequest", {
      method: "POST",
      headers: {
        'Content-Type': 'Application/json'
      },
      body: JSON.stringify({ userid: localStorage.getItem("uniqueid") })
    }
    );

    let data = await response.json();
    setrequest(data.totalrequest);
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
      ) :( 
        <>
      <Navbar/>
      
        {totalrequest.length ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '80%', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '20px', marginTop: '20px' }}>
             
              <h3 style={{ width: '100%', textAlign: 'center', marginBottom: '20px', backgroundColor: '#4CAF50', color: 'white', padding: '15px', borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
                In Processing...
              </h3>
    
              
              {totalrequest.map((val) => (
                <div key={val._id} style={{ width: '48%' }}>
                  <RequestBox val={val} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <h3 style={{ textAlign: 'center', backgroundColor: '#FF7043', color: 'white', padding: '15px', borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
              No Request Found
            </h3>
          </div>
        )}
        </>
      
      )
      }
      
      <ToastContainer />
      <div className="footer-copyright">
        Created By<br/> - Pranav 
      </div>
    </div>
  );
  
}

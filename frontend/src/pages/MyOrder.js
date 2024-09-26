import React, { useEffect, useState } from 'react'
import Navbar from './Navbar';
import { DNA } from 'react-loader-spinner'
import SellBox from '../components/SellBox';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

export default function MyOrder() {

  const [totalrequest, setrequest] = useState([]);
  const [dataque, setData] = useState([]);
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

    try{
    let response = await fetch("https://ticket-trading.onrender.com/check/myorder", {
      method: "POST",
      headers: {
        'Content-Type': 'Application/json'
      },
      body: JSON.stringify({ userid: localStorage.getItem("uniqueid") })
    }
    );

    let data = await response.json();
    setrequest(data.totalorder);

    let responseQue = await fetch("https://ticket-trading.onrender.com/api/displaydata", {
      method: "POST",
      headers: {
        'Content-Type': 'Application/json'
      }
    }
    );

    let newdata = await responseQue.json();
    setData(newdata.question);
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
      {loading ? (<DNA
        visible={true}
        height="400"
        width="400"
        ariaLabel="dna-loading"
        wrapperStyle={{}}
        wrapperClass="dna-wrapper"
        />)
      :
      (
        <>
      <Navbar />
        {totalrequest.length ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '80%', display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'space-between' }}>
            <h3 style={{ width: '100%', textAlign: 'center', marginBottom: '20px', backgroundColor: '#4CAF50', color: 'white', padding: '15px', borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
                Current Holding
              </h3>
              {totalrequest.map((val) => 
                dataque.filter((item) => item._id === val.questionid).map((valque) => (
                  <div key={val._id} style={{ width: '48%', display: 'flex', flexDirection: 'column' }}>
                    <SellBox val={val} valque={valque} />
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <h3 style={{ textAlign: 'center', backgroundColor: '#FF7043', color: 'white', padding: '15px', borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
              No Order Found
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

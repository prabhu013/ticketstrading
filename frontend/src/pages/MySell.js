import React, { useEffect, useState } from 'react'
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { DNA } from 'react-loader-spinner'
import { format } from 'date-fns';
import { toast, ToastContainer } from 'react-toastify';

export default function MySell() {

    const [totalrequest, setrequest] = useState([]);
    const [loading,setLoading]=useState(true);
    const [netprofit, setnetprofit] = useState(0);
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
        let response = await fetch("https://ticket-trading.onrender.com/check/mysell", {
            method: "POST",
            headers: {
                'Content-Type': 'Application/json'
            },
            body: JSON.stringify({ userid: localStorage.getItem("uniqueid") })
        }
        );

        let data = await response.json();
        setrequest(data.totalrequest);

        setnetprofit(data.netprofit)
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
          )
          :
          (
            <>
            <Navbar />
          {totalrequest.length ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '80%', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '20px' }}>
                {/* Improved Net Profit Display */}
                {netprofit >= 0 ? (
                  <div style={{ width: '100%', textAlign: 'center', marginBottom: '20px', backgroundColor: '#4CAF50', color: 'white', padding: '15px', borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
                    <h3 style={{ margin: 0 }}>Net Profit: +{netprofit}</h3>
                  </div>          
                ) : (
                  <div style={{ width: '100%', textAlign: 'center', marginBottom: '20px', backgroundColor: '#FF7043', color: 'white', padding: '15px', borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
                    <h2 style={{ margin: 0 }}>Net Loss: {netprofit}</h2>
                  </div>
                )}
      
                {totalrequest.map((val) => {
                  const netValue = val.value - val.originalvalue;
                  const isProfit = netValue >= 0;
      
                  return (
                    <div key={val._id} style={{ width: '48%', backgroundColor: 'white', border: `2px solid ${isProfit ? 'green' : 'red'}`, padding: '10px', borderRadius: '10px', marginBottom: '20px' }}>
                      <div style={{ textAlign: 'end', padding: '5px' }}>
                        On: <span style={{ fontWeight: 'bold' }}>{format(new Date(val.updatedAt), 'HH:mm, dd/MM/yy')}</span>
                      </div>
                      <div style={{ borderBottom: '1px solid black', paddingBottom: '10px', textAlign: 'center' }}>
                        <h3>{val.question}</h3>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                        <div style={{ display: 'block', alignItems: 'center', textAlign: 'center', marginRight: '20px' }}>
                          <h5>Sell:</h5>
                        </div>
                        <div style={{ width: '150px', display: 'block', textAlign: 'center' }}>
                          <div style={{ backgroundColor: isProfit ? 'green' : 'red', color: 'white', padding: '5px', alignItems: 'center' }}>
                            {val.ans} at {val.value}
                          </div>
                        </div>
                        <div style={{ marginLeft: '20px' }}>
                          <div
                            style={{
                              border: `1px solid ${isProfit ? 'green' : 'red'}`,
                              width: '150px',
                              height: '34px',
                              padding: '5px',
                              display: 'block',
                              textAlign: 'center',
                              alignItems: 'center',
                              color: isProfit ? 'green' : 'red',
                              backgroundColor: 'white',
                            }}
                          >
                            {isProfit ? `Profit: +${netValue}` : `Loss: ${netValue}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <h3 style={{ textAlign: 'center' }}>Sell Order to Start :)</h3>
            </div>
          )}
            </>
          )
          }
          <ToastContainer/>
          <div className="footer-copyright">
        Created By<br/> - Pranav 
      </div>
        </div>
      );
      
}
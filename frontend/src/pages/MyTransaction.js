import React, { useEffect, useState } from 'react'
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {toast, ToastContainer } from 'react-toastify';
import { DNA } from 'react-loader-spinner'

export default function MyTransaction() {
    const [transc, setTransc] = useState([])
    const [ordertransc, setOrdertransc] = useState([])
    const [loading,setLoading]=useState(true);
  
    const navigate = useNavigate();
    const loaddata = async () => {

        if (!localStorage.getItem("authToken") || !localStorage.getItem('uniqueid')) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("uniqueid");
            navigate('/signup');
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
            navigate('/signup');
            return
        }

try {
        let response = await fetch("https://ticket-trading.onrender.com/payment/display", {
            method: "POST",
            headers: {
                'Content-Type': 'Application/json'
            },
            body: JSON.stringify({ userid: localStorage.getItem("uniqueid") })
        }
        );

        let data = await response.json();
        setTransc(data.totalrequest);

        let alltransc = await fetch("https://ticket-trading.onrender.com/payment/alltransc", {
            method: "POST",
            headers: {
                'Content-Type': 'Application/json'
            },
            body: JSON.stringify({ userid: localStorage.getItem("uniqueid") })
        }
        );

        let datatransc = await alltransc.json();
        setOrdertransc(datatransc.totalrequest);
    }
    catch {
        toast.error("Failed to load data.",{position: "top-right"});
      }
      finally {
        setTimeout(()=>{
          setLoading(false);
        },1000)
      }
        // console.log(data.totalrequest);
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
            (<>
            <Navbar />
            <h3 style={{ display: 'block', alignItems: 'center', textAlign: 'center' }}>All Transactions</h3>
            <div style={{ display: 'flex', padding: '20px' }}>

                <div style={{marginLeft:'10px'}}>
                    <h3 style={{ display: 'block', justifyContent: 'center', alignItems: 'center', textAlign: 'center', marginLeft: '5px' }}>All Payments</h3>
                    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        {
                            transc.map((val) => {
                                return (

                                    <div key={val._id} style={{ backgroundColor: 'white', width: '600px', border: '2px solid green', padding: '10px', marginBottom: '20px' }}>
                                        <div style={{

                                            top: '10px',
                                            textAlign: 'end',
                                            padding: '5px'


                                        }}>
                                            Trx ID : <span style={{ fontWeight: 'inherit' }}>{val.trc_id}</span>
                                        </div>
                                        <div style={{

                                            top: '10px',
                                            textAlign: 'end',
                                            padding: '5px'


                                        }}>
                                            Done On : <span style={{ fontWeight: 'bold' }}>{format(new Date(val.updatedAt), 'HH:mm, dd/MM/yy')}</span>
                                        </div>
                                        {val.chk === 'true'
                                            ?
                                            <>
                                                <div style={{ color: 'green', borderBottom: '1px solid black', paddingBottom: '10px', textAlign: 'initial' }}>
                                                    <h3>SUCCESS</h3>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                                                    <div style={{ display: 'block', alignItems: 'center', textAlign: 'center', marginRight: '20px' }}>
                                                        <h5>Amount :</h5>
                                                    </div>
                                                    <div style={{ width: '250px', display: 'flex', textAlign: 'center' }}>

                                                        <div style={{ width: '100px', backgroundColor: 'green', display: 'inline', color: 'white', padding: '5px', alignItems: 'center' }} >{Math.round(val.amount * 10) / 10} </div>


                                                    </div>
                                                </div>
                                            </>
                                            :
                                            <>
                                                <div style={{ color: 'red', borderBottom: '1px solid black', paddingBottom: '10px', textAlign: 'initial' }}>
                                                    <h3>FAIL</h3>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                                                    <div style={{ display: 'block', alignItems: 'center', textAlign: 'center', marginRight: '20px' }}>
                                                        <h5>Amount :</h5>
                                                    </div>
                                                    <div style={{ width: '250px', display: 'flex', textAlign: 'center' }}>

                                                        <div style={{ width: '100px', backgroundColor: 'red', display: 'inline', color: 'white', padding: '5px', alignItems: 'center' }} >{Math.round(val.amount * 10) / 10}</div>


                                                    </div>
                                                </div>
                                            </>
                                        }

                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div style={{ marginLeft: '20px' }}>
                    <h3 style={{ display: 'block', justifyContent: 'center', alignItems: 'center', textAlign: 'center', }}>All Orders Trx</h3>
                    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        {
                            ordertransc.map((val) => {
                                return (

                                    <div key={val._id} style={{ backgroundColor: 'white', width: '600px', border: '2px solid green', padding: '10px', marginBottom: '20px' }}>
                                        <div style={{

                                            top: '10px',
                                            textAlign: 'end',
                                            padding: '5px',


                                        }}>
                                            Trx ID : {val._id}
                                        </div>
                                        <div style={{

                                            top: '10px',
                                            textAlign: 'end',
                                            padding: '5px'


                                        }}>
                                            Done On : <span style={{ fontWeight: 'bold' }}>{format(new Date(val.updatedAt), 'HH:mm, dd/MM/yy')}</span>
                                        </div>
                                        {val.chk === '1'
                                            ?
                                            <>
                                                <div style={{ borderBottom: '1px solid black', paddingBottom: '10px' }}>
                                                    <h3>{val.question}</h3>
                                                </div>
                                                <div style={{ display: 'flex', width: '100%', textAlign: 'center', justifyContent: 'center', marginTop: '10px' }}>
                                                    <h5 style={{ display: 'flex', textAlign: 'center' }}>BUY :</h5>

                                                    <div style={{ display: 'flex', textAlign: 'center', alignItems: 'center' }}>

                                                        <div style={{ width: '100px', backgroundColor: 'red', display: 'inline', color: 'white', padding: '5px', alignItems: 'center', marginLeft: '20px' }} > -{val.amount} </div>


                                                    </div>
                                                    <div style={{ display: 'flex', textAlign: 'center', alignItems: 'center' }}>

                                                        <div style={{ display: 'inline', padding: '5px', alignItems: 'center', marginLeft: '20px' }} ><span style={{ fontWeight: 'bold' }}>Balance :</span> <span style={{ color: 'green', fontWeight: 'bold' }}>₹ {Math.round(val.netmoney * 10) / 10}</span></div>


                                                    </div>

                                                </div>

                                            </>
                                            :
                                            <>
                                                {val.chk === '2'
                                                    ?
                                                    <>
                                                        <div style={{ borderBottom: '1px solid black', paddingBottom: '10px' }}>
                                                            <h3>{val.question}</h3>
                                                        </div>
                                                        <div style={{ display: 'flex', width: '100%', textAlign: 'center', justifyContent: 'center', marginTop: '10px' }}>
                                                            <h5 style={{ display: 'flex', textAlign: 'center' }}>REFUND :</h5>

                                                            <div style={{ display: 'flex', textAlign: 'center', alignItems: 'center' }}>

                                                                <div style={{ width: '100px', backgroundColor: 'green', display: 'inline', color: 'white', padding: '5px', alignItems: 'center', marginLeft: '20px' }} > +{val.amount} </div>


                                                            </div>
                                                            <div style={{ display: 'flex', textAlign: 'center', alignItems: 'center' }}>

                                                                <div style={{ display: 'inline', padding: '5px', alignItems: 'center', marginLeft: '20px' }} ><span style={{ fontWeight: 'bold' }}>Total Money :</span> <span style={{ color: 'green', fontWeight: 'bold' }}>₹ {Math.round(val.netmoney * 10) / 10}</span></div>


                                                            </div>
                                                        </div>
                                                    </>
                                                    :
                                                    <>
                                                        <div style={{ borderBottom: '1px solid black', paddingBottom: '10px' }}>
                                                            <h3>{val.question}</h3>
                                                        </div>
                                                        <div style={{ display: 'flex', width: '100%', textAlign: 'center', justifyContent: 'center', marginTop: '10px' }}>
                                                            <h5 style={{ display: 'flex', textAlign: 'center' }}>SELL :</h5>

                                                            <div style={{ display: 'flex', textAlign: 'center', alignItems: 'center' }}>
                                                                {val.amount >= '0'
                                                                    ?
                                                                    <div style={{ width: '100px', backgroundColor: 'green', display: 'inline', color: 'white', padding: '5px', alignItems: 'center', marginLeft: '20px' }} > +{val.amount} </div>

                                                                    :
                                                                    <div style={{ width: '100px', backgroundColor: 'red', display: 'inline', color: 'white', padding: '5px', alignItems: 'center', marginLeft: '20px' }} > {val.amount} </div>

                                                                }

                                                            </div>
                                                            <div style={{ display: 'flex', textAlign: 'center', alignItems: 'center' }}>

                                                                <div style={{ display: 'inline', padding: '5px', alignItems: 'center', marginLeft: '20px' }} ><span style={{ fontWeight: 'bold' }}>Total Money :</span> <span style={{ color: 'green', fontWeight: 'bold' }}>₹ {Math.round(val.netmoney * 10) / 10}</span></div>


                                                            </div>
                                                        </div>
                                                    </>
                                                }
                                            </>
                                        }

                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            </>)}
            
            <ToastContainer/>
        </div>
    )
}

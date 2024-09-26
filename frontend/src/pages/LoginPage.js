import React, { useState , useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { DNA } from 'react-loader-spinner'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './Navbar';


const LoginPage = () => {
  const navigate = useNavigate();
  const [loading,setLoading]=useState(true);

  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });
  const { email, password } = inputValue;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-right",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const response = await fetch("https://ticket-trading.onrender.com/api/loginuser",{
            method : 'Post',
            headers : {
              'Content-Type' : 'application/json'
            },
            body:JSON.stringify({email:inputValue.email,password : inputValue.password})
          });
      
          const json = await response.json();
     
      
      if (json.success) {
        handleSuccess("User logged in successfully");
        setTimeout(() => {
          localStorage.setItem("authToken",json.authToken)
       localStorage.setItem("uniqueid",json.id)
          navigate("/");
        }, 1000);
      } else {
        handleError("Incorrect password or email");
      }
    } catch (error) {
      console.log(error);
    }
    setInputValue({
      ...inputValue,
      email: "",
      password: "",
    });
  };

  useEffect(() => {


    setTimeout(()=>{
      setLoading(false);
    },2000)
    // eslint-disable-next-line
}, [])

  return (
    <>
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
    

    <div className="form_container">
          <h2>Login Account</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                placeholder="Enter your email"
                onChange={handleOnChange}
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                value={password}
                placeholder="Enter your password"
                onChange={handleOnChange}
              />
            </div>
            <button type="submit">Submit</button>
            <span>
              New User? <Link to={"/signup"}>Signup</Link>
            </span>
            
          </form>
          
        </div>
      </>
    )}
    
    <ToastContainer />
    <div className="footer-copyright">
        Created By<br/> - Pranav 
      </div>
    </>
  );
};

export default LoginPage;

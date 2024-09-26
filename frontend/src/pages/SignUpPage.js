import React, { useState ,useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { DNA } from 'react-loader-spinner'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "../CSS/index.css"
import Navbar from './Navbar';


const SignUpPage = () => {
  
  const navigate = useNavigate();
  const [loading,setLoading]=useState(true);
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    username: "",
  });
  const { email, password, username } = inputValue;
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
     

        const response = await fetch("https://ticket-trading.onrender.com/api/createuser",{
      method : 'Post',
      headers : {
        'Content-Type' : 'application/json'
      },
      body:JSON.stringify({name: inputValue.username,email:inputValue.email,password:inputValue.password})
    });

    const json = await response.json();
      
      if (json.success) {
        handleSuccess("User logged in successfully");
        localStorage.setItem("authToken",json.authToken)
      localStorage.setItem("uniqueid",json.id)
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        handleError(json.message);
      }
    } catch (error) {
      console.log(error);
    }
    setInputValue({
      ...inputValue,
      email: "",
      password: "",
      username: "",
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
    (<>
    <Navbar />
    
    <div className="form_container">
      <h2>Signup Account</h2>
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
          <label htmlFor="email">Username</label>
          <input
            type="text"
            name="username"
            value={username}
            placeholder="Enter your username"
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
          Already have an account? <Link to={"/login"}>Login</Link>
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

export default SignUpPage;

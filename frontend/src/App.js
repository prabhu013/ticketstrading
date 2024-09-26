import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import MyRequest from './pages/MyRequest';
import MyOrder from './pages/MyOrder';
import MySell from './pages/MySell';
import MyWallet from './pages/MyWallet';
import MyTransaction from './pages/MyTransaction';
import TryLuck from './pages/TryLuck';



const App = () => {



  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/myrequest" element={<MyRequest />} />
          <Route exact path="/myorder" element={<MyOrder />} />
          <Route exact path="/mysell" element={<MySell />} />
          <Route exact path="/mywallet" element={<MyWallet />} />
          <Route exact path="/mytransaction" element={<MyTransaction />} />
          <Route exact path="/login" element={<LoginPage />} />
          <Route exact path="/signup" element={<SignUpPage />} />
          <Route exact path="/tryluck" element={<TryLuck />} />
          <Route path={"*"} element={<SignUpPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

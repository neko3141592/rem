import './App.scss';
import Router from "./Router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { createContext, useEffect, useState } from 'react';
import Axios from 'axios';
import { base } from './BaseUrl';
import { useNavigate } from 'react-router-dom';
import Footer from './components/Footer';

export const userData = createContext(null);

function App() {
  //userAuth
  const [user] = useAuthState(auth);
  const [data , setData] = useState(null);
  useEffect(() => {
    if (!user) {
      setData(null);
      return;
    }
    const head = {
      email: user.email,
    }
    Axios.get(`${base}/api/user/create` , {params: head})
    .then (res => {
      setData({
        email:user.email
      })
    })
    .catch (error => {
      console.log(`${base}/api/user/create`);
      console.error(error);
    })
  } , [user]);

  //App
  return (
    <userData.Provider value={data}>
      <div className="App">
        <Router/>
      </div>
    </userData.Provider>
    
  );
}

export const Logout = () => {
  auth.signOut();
  window.location.reload();
}

export default App;

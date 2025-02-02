import React, { useEffect } from 'react';
import './App.css';
import HomeScreen from './Screens/HomeScreen';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginScren from './Screens/LoginScren';
import { auth } from './firebase';
import {useDispatch, useSelector} from 'react-redux'
import { login, logout, selectUser } from './features/userSlice';
import ProfileScreen from './Screens/ProfileScreen';

function App() {

  const user = useSelector(selectUser)
  const dispatch =  useDispatch()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(userAuth => { //keeps the user signed in on start
      if (userAuth) {
        //logged in
        dispatch(login({
          uid: userAuth.uid,
          email: userAuth.email,
        }))
      }
      else {
        //logged out
        dispatch(logout()) //resets the user back to null
      }
    })

    return unsubscribe
  }, [dispatch])

  return (
    <div className="app">
      <Router>
        {!user ? <LoginScren/> : 
          <Routes>
            <Route exact path="/" element={<HomeScreen />} />
            <Route exact path="/profile" element={<ProfileScreen/>} />
          </Routes>
        }
        
      </Router>
    </div>
  );
}

export default App;

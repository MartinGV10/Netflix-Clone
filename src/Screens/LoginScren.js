import React, { useState } from 'react'
import './LoginScreen.css'
import SignupScreen from './SignupScreen'

function LoginScren() {

  const [signIn, setSignIn] = useState(false)


  return (
    <div className='loginscreen'>
        <div className='loginScreen-background'>
            <img 
                src='https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png'
                className='loginScreen-logo'
            ></img>
            <button className='loginScreen-button' onClick={() => setSignIn(true)}>Sign In</button>

            <div className='loginScreen-gradient'>
              
            </div>

            <div className='loginScreen-body'>
              {signIn ? (
                <SignupScreen/>
              ) : (
                <>
                  <h1>Unlimited films, TV programmes and more.</h1>
                  <h2>Watch anywhere. Cancel at any time</h2>
                  <h3>Ready to watch? Enter your email to create or restart your membership</h3>
                  
                  <div className='loginScreen-input'>
                    <form>
                      <input type='email' placeholder='Email address'/>
                      <button className='loginScren-getStarted' onClick={() => setSignIn(true)}>GET STARTED</button>
                    </form>
                  </div>
              </>
              )}

            </div>
        </div>
    </div>
  )
}

export default LoginScren
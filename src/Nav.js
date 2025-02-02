import React, { useEffect, useState } from 'react'
import './Nav.css'
import {useNavigate} from 'react-router-dom'

function Nav() {

    const [show, setShow] = useState(false)
    const navigate = useNavigate()

    const transitionNavBar = () => {
        if (window.scrollY > 100) {
            setShow(true)
        }
        else {
            setShow(false)
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', transitionNavBar)
        return () => window.removeEventListener('scroll', transitionNavBar)
    }, [])

  return (
    <div className={`nav ${show && 'nav_black'}`}>
        <div className='nav_contents'>
            <img  className='nav_logo' src='https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png' onClick={() => navigate('/')}></img>

            <img className='nav_avatar' src='https://static.wikia.nocookie.net/925fa2de-087e-47f4-8aed-4f5487f0a78c/scale-to-width/755' onClick={() => navigate('/profile')}></img>
        </div>

    </div>
  )
}

export default Nav
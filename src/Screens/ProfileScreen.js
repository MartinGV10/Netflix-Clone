import React from 'react'
import Nav from '../Nav'
import { useSelector } from 'react-redux'
import { selectUser } from '../features/userSlice'
import './ProfileScreen.css'
import { auth } from '../firebase'
import PlansScreen from './PlansScreen'

function ProfileScreen() {

    const user = useSelector(selectUser)

    return (
    <div className='profileScreen'>
        <Nav/>
        <div className='profileScreen-body'>
            <h1>Edit Profile</h1>
            <div className='profileScreen-info'>
                <img src='https://static.wikia.nocookie.net/925fa2de-087e-47f4-8aed-4f5487f0a78c/scale-to-width/755'/>
                <div className='profileScreen-details'>
                    <h2>{user.email}</h2>
                    <div className='profileScreen-plans'>
                        <h3>Plans</h3>

                        <PlansScreen/>
                        <button onClick={() => auth.signOut()} className='profileScreen-signOut'>Sign Out</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ProfileScreen
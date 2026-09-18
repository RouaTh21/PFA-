import React from 'react'
import { Link } from 'react-router-dom'

const Proprietaire = () => {
  return (
    <section className='container mt-5'>
        <h2>Welcome to Proprietaire Panel </h2>
        <hr/>
        <Link to={"/existing-rooms"}>Manage Room</Link> <br/>
        <Link to={"/existing-bookings"}>Manage Bookings</Link>
      
    </section>
  )
}

export default Proprietaire
//FindBooking :1.38.08
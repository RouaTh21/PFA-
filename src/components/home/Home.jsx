import React from 'react'
import MainHeader from '../layout/MainHeader'
import StumodationService from '../common/StumodationService'
import Parallax from '../common/Parallax'
import RoomCarousel from '../common/RoomCarousel'

const Home = () => {
  return (
    <section>
      <MainHeader/>
      <section className='container'>
        
        <RoomCarousel/>
        <Parallax/>
        <StumodationService/>
        <Parallax/>
      
      </section>
    </section>
  )
}

export default Home

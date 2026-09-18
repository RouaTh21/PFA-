import React from 'react'
import { useState } from 'react'
import {cancelBooking, getBookingByConfirmationCode} from '../utils/ApiFunctions'
function FindBooking() {
    const[confirmationCode, setConfirmationCode]= useState("")
    const[error, setError]= useState(null)
    const[successMessage,setSuccessMessage]=useState("")
    const[isLoading, setIsLoading]= useState(false)
    const[bookingInfo, setBookingInfo]= useState({
        bookingId:"",
        room:{id:"",roomType: ""},
        bookingConfirmationCode: "",
        checkInDate: "",
        checkOutDate: "",
        guestName:"",
        guestEmail:"",
        numOfGuest:""
    })
    const [isDeleted, setIsDeleted] = useState(false)

    const emptyBookingInfo = {
        bookingId:"",
        room:{id:"",roomType: ""},
        bookingConfirmationCode: "",
        checkInDate: "",
        checkOutDate: "",
        guestName:"",
        guestEmail:"",
        numOfGuest:""
    }
    const handleInputChange = (e) =>{
        setConfirmationCode(e.target.value)
    }
    const handleFormSubmit = async(e)=> {
        e.preventDefault()
        setIsLoading(true)
        try{
            const data = await getBookingByConfirmationCode(confirmationCode)
            setBookingInfo(data)

        }catch(error){
            setBookingInfo(emptyBookingInfo)
            if(error.response && error.response.status === 404){
                setError(error.response.data.message)
            }else{
                setError(error.message)
            }
        }
        setTimeout(() =>{
            setIsLoading(false)
        },2000)
    }
    const handleBookingCancellation = async(bookingIdd) =>{
        try{
            await cancelBooking(bookingInfo.bookingId)
            setIsDeleted(true)
            setSuccessMessage("Booking has been cancelled successfully!")
            setBookingInfo(emptyBookingInfo)
            setConfirmationCode("")
            setError("")

        }catch(error){
            setError(error.message)  }
            setTimeout(()=>{
                setSuccessMessage("")
                setIsDeleted(false)
            },2000)
    }
  return (
    //2:51:20
    <>
    <div className='container mt-5 d-flex flex-column 
      justify-content-center align-items-center'>
        <h2>Find My Booking</h2>
        <form onSubmit={handleFormSubmit} className='col-md-6'>
            <div className='input-group mb-3'>
                <input
                className='form-control'
                id="confirmationCode"
                name="confirmationCode"
                value={confirmationCode}
                onChange={handleInputChange}
                placeholder="Enter the booking confirmation code"/>
                <button className='btn btn-hotel input-group-text'> Find booking </button>
            </div>
        </form>
        {isLoading ? ( <div>Finding booking ... </div>
        ): error ? (<div className='text-danger'>{error}</div>
    
        ): bookingInfo.bookingConfirmationCode ? (
            <div className='col-md-6 mt-4 mb-5'>
                <h3>Booking Information</h3>
                <p>Booking Confirmation Code : {bookingInfo.bookingConfirmationCode}</p>
                <p>Booking ID :  {bookingInfo.bookingId}</p>
                <p>Room Number :  {bookingInfo.room.id}</p>
                <p>Room Number :  {bookingInfo.room.roomType}</p>
                <p>Check-in Date :  {bookingInfo.checkInDate}</p>
                <p>Check-out Date :  {bookingInfo.checkOutDate}</p>
                <p>Name :  {bookingInfo.guestName}</p>
                <p>Email Address :  {bookingInfo.guestEmail}</p>
                <p>Total Student :  {bookingInfo.numOfGuest}</p>

                {!isDeleted && (
                    <button
                    className='btn btn-danger'
                    onClick={()=>handleBookingCancellation(bookingInfo.bookingId)}>Cancle Booking</button>
                )}
            </div>
        ): (
            <div>Find booking ...</div>
        )}

        {isDeleted && (
            <div className='alert alert-success mt-3' role="alert"> {successMessage}</div>
        )}
    </div>
    </>
  )
}

export default FindBooking

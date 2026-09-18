import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Form,FormControl } from 'react-bootstrap'
import {  useNavigate, useParams } from 'react-router-dom'
import BookingSummary from './BookingSummary'
import { getRoomById,bookRoom} from "../utils/ApiFunctions"
const BookingForm = () => {
    const[isValidated, setIsValidated]= useState(false)
    const[isSubmitted, setIsSubmitted]= useState(false)
    const[errorMessage, setErrorMessage]= useState("")
    const[roomPrice, setRoomPrice]= useState(0)
    const[booking, setBooking]= useState({
        guestName:"",
        guestEmail:"",
        checkInDate:"",
        checkOutDate:"",
    })

    const[roomInfo, setRoomInfo]= useState({
        photo:"",
        roomType:"",
        roomPrice:""
    })
    const {roomId} = useParams()
    const navigate = useNavigate()

    const handleInputChange = (e) =>{
        const{name, value} = e.target
        setBooking({...booking, [name]: value})
        setErrorMessage("")
    }
    const getRoomPriceById = async(roomId) =>{
        try{
            const response = await getRoomById(roomId)
            setRoomPrice(response.roomPrice)

        }catch(error){
            throw new Error(error)
        }
    }
    useEffect(() =>{
        getRoomPriceById(roomId)
    }, [roomId])

    const calculatePayment = ()=>{
        const checkInDate = moment(booking.checkInDate)
        const checkOutDate = moment(booking.checkOutDate)
        const numOfMonths = checkOutDate.diff(checkInDate)
        const price = roomPrice ? roomPrice : 0
        return numOfMonths * price
    }
    const isCheckOutDateValid = () =>{
        if(!moment(booking.checkOutDate). isSameOrAfter(moment(booking.checkInDate))){
            setErrorMessage("Check-out date must come before check-in date")
            return false
        }else{
            setErrorMessage("")
        return true
        }
    }
    const handleSubmit = (e)=>{
        e.preventDefault();
        const form = e.currentTarget
        if (form.checkValidity() === false || !isCheckOutDateValid()){
            e.stopPropagation();
    }else{
            setIsSubmitted(true);
    }
    setIsValidated(true);
    }

    const handleFormSubmit = async() =>{
        try{
            const confirmationCode = await bookRoom(roomId, booking)
            setIsSubmitted(true)
            navigate("/booking-success", {state:{message : confirmationCode}})
        }catch(error){
            setErrorMessage(error.message)
            navigate("/booking-success", {state:{error : errorMessage}})
        }
    }
    return (
        <div className='container mb-5'>
            <div className='row'>
                <div className='col-md-7'>
                    <div className='card card-body mt-6'>
                        <h4 className='card card-title'>Reserve Room</h4>
                        <Form noValidate validated={isValidated} onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label htmlFor="guestName">Name:</Form.Label>
                                <FormControl
                                    required
                                    type="text"
                                    id="guestName"
                                    name="guestName"
                                    value={booking.guestName}
                                    placeholder='Enter your Name'
                                    onChange={handleInputChange}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please enter your Name
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label htmlFor="guestEmail">Email:</Form.Label>
                                <FormControl
                                    required
                                    type="email"
                                    id="guestEmail"
                                    name="guestEmail"
                                    value={booking.guestEmail}
                                    placeholder='Enter your Email'
                                    onChange={handleInputChange}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please enter your Email
                                </Form.Control.Feedback>
                            </Form.Group>

                            <fieldset style={{ border: "2px" }}>
                                <legend>Lodging period</legend>
                                <div className='row'>
                                    <div className='col-6'>
                                        <Form.Label htmlFor="checkInDate">Check-In date:</Form.Label>
                                        <FormControl
                                            required
                                            type="date"
                                            id="checkInDate"
                                            name="checkInDate"
                                            value={booking.checkInDate}
                                            placeholder='Check-in date'
                                            onChange={handleInputChange}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please select a check-in date
                                        </Form.Control.Feedback>
                                    </div>

                                    <div className='col-6'>
                                        <Form.Label htmlFor="checkOutDate">Check-Out date:</Form.Label>
                                        <FormControl
                                            required
                                            type="date"
                                            id="checkOutDate"
                                            name="checkOutDate"
                                            value={booking.checkOutDate}
                                            placeholder='Check-out date'
                                            onChange={handleInputChange}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please select a check-out date
                                        </Form.Control.Feedback>
                                    </div>
                                    {errorMessage && <p className='error-message text-danger'>{errorMessage}</p>}
                                </div>
                            </fieldset>

                            <div className='form-group mt-2 mb-2'>
                                <button type="submit" className='btn btn-hotel'>Continue</button>
                            </div>
                        </Form>
                    </div>
                </div>
                
                <div className='col-md-7'>
                    {isSubmitted && (
                        <BookingSummary
                            booking={booking}
                            payment={calculatePayment()}
                            isFormValid={isValidated}
                            onConfirm={handleFormSubmit} />
                    )}
                </div>
            </div>
        </div>
    );
}
export default BookingForm

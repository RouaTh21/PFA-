import { Button } from 'react-bootstrap';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BookingSummary = ({ booking, payment, isFormValid, onConfirm }) => {
    const checkInDate = moment(booking.checkInDate);
    const checkOutDate = moment(booking.checkOutDate);
    const numOfMonths = checkOutDate.diff(checkInDate, "month");
    const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const navigate = useNavigate();

    const handleConfirmBooking = () => {
        setIsProcessingPayment(true);
        setTimeout(() => {
            setIsProcessingPayment(false);
            setIsBookingConfirmed(true);
            onConfirm();
        }, 3000);
    };

    useEffect(() => {
        if (isBookingConfirmed) {
            navigate("/booking-success");
        }
    }, [isBookingConfirmed, navigate]);
    const formattedPayment = new Intl.NumberFormat('en-TN', { style: 'currency', currency: 'TND' }).format(payment);


    return (
        <div className='card card-body mt-5'>
            <h4>Reservation Summary</h4>

            <p>Name: <strong>{booking.guestName}</strong></p>
            <p>Email: <strong>{booking.guestEmail}</strong></p>
            <p>Check-In Date: <strong>{moment(booking.checkInDate).format("MMM Do YYYY")}</strong></p>
            <p>Check-Out Date: <strong>{moment(booking.checkOutDate).format("MMM Do YYYY")}</strong></p>
            <p>Number of Months: <strong>{numOfMonths}</strong></p>

            {payment > 0 ? (
                <>
                    <p>Total Payment: <strong>{formattedPayment}</strong></p>

                    {isFormValid && !isBookingConfirmed ? (
                        <Button variant='success' onClick={handleConfirmBooking}>
                            {isProcessingPayment ? (
                                <>
                                    <span className='spinner-border spinner-border-sm mr-2' role='status' aria-hidden="true"></span>
                                    Booking Confirmed, redirecting to payment ....
                                </>
                            ) : (
                                "Confirm Booking and proceed to payment"
                            )}
                        </Button>
                    ) : isBookingConfirmed ? (
                        <div className='d-flex justify-content-center align-items-center'>
                            <div className='spinner-border text-primary' role="status">
                                <span className='sr-only'>Loading</span>
                            </div>
                        </div>
                    ) : null}
                </>
            ) : (
                <p className='text-danger'>Check-out date must be after check-in date</p>
            )}

        </div>
    );
};

export default BookingSummary;

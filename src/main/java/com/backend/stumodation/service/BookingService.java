package com.backend.stumodation.service;

import com.backend.stumodation.exception.InvalidBookingRequestException;
import com.backend.stumodation.exception.ResourceNotFoundException;
import com.backend.stumodation.model.BookedRoom;
import com.backend.stumodation.model.Room;
import com.backend.stumodation.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor

public class BookingService implements IBookingService{
    private final BookingRepository bookingRepository;
    private final IRoomService roomService;

    @Override
    public String saveBooking(Long roomId, BookedRoom bookingRequest) {
        if (bookingRequest.getCheckOutDate() == null || bookingRequest.getCheckInDate() == null) {
            throw new InvalidBookingRequestException("Check-in date or check-out date is null");
        }
        if (bookingRequest.getCheckOutDate().isBefore(bookingRequest.getCheckInDate())) {
            throw new InvalidBookingRequestException("Check-in date must come before check-out date");
        }
        Room room = roomService.getRoomById(roomId).orElseThrow(() -> new RuntimeException("Room not found"));
        List<BookedRoom> existingbookings = room.getBookings();
        boolean roomIsAvailable = roomIsAvailable(bookingRequest, existingbookings);
        if (roomIsAvailable) {
            room.addBooking(bookingRequest);
            bookingRepository.save(bookingRequest);
        } else {
            throw new InvalidBookingRequestException("Sorry, This room is not available for the selected dates");
        }
        return bookingRequest.getBookingConfirmationCode();
    }


    @Override
    public List<BookedRoom> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public void cancelBooking(Long bookingId) {
        bookingRepository.deleteById(bookingId);

    }

    public List<BookedRoom> getAllBookingsByRoomId(Long roomId) {

        return bookingRepository.findByRoomId(roomId);
    }
    @Override
    public BookedRoom findByBookingConfirmationCode(String confirmationCode) {
        return bookingRepository.findByBookingConfirmationCode(confirmationCode)
                .orElseThrow(()->new ResourceNotFoundException("No booking found with booking code :"+confirmationCode));
    }

    private boolean roomIsAvailable(BookedRoom bookingRequest, List<BookedRoom> existingbookings) {
        return existingbookings.stream()
                .noneMatch(existingbooking ->
                        bookingRequest.getCheckInDate().equals(existingbooking.getCheckInDate())
                                || bookingRequest.getCheckOutDate().isBefore(existingbooking.getCheckInDate())
                                || (bookingRequest.getCheckInDate().isAfter(existingbooking.getCheckInDate())
                                && bookingRequest.getCheckInDate().isBefore(existingbooking.getCheckInDate()))
                                || (bookingRequest.getCheckInDate().isBefore(existingbooking.getCheckInDate())

                                && bookingRequest.getCheckOutDate().equals(existingbooking.getCheckOutDate()))
                                || (bookingRequest.getCheckInDate().isBefore(existingbooking.getCheckInDate())

                                && bookingRequest.getCheckOutDate().isAfter(existingbooking.getCheckOutDate()))

                                || (bookingRequest.getCheckInDate().equals(existingbooking.getCheckOutDate())
                                && bookingRequest.getCheckOutDate().equals(existingbooking.getCheckInDate()))

                                || (bookingRequest.getCheckInDate().equals(existingbooking.getCheckOutDate())
                                && bookingRequest.getCheckOutDate().equals(existingbooking.getCheckInDate()))

                );
    }


}
//I replace the getGetCheckoutdate with getCheckInDate
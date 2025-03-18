package com.backend.stumodation.exception;

public class InternalServerException extends RuntimeException{

    public InternalServerException(String message) {
        super(message);
    }
}

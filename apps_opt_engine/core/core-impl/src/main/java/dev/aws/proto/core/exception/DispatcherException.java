package dev.aws.proto.core.exception;

public class DispatcherException extends RuntimeException {
    public DispatcherException(String message, Throwable cause) {
        super(message, cause);
    }

    public DispatcherException(String message) {
        super(message);
    }
}

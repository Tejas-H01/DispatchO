package dev.aws.proto.core.routing.exception;

public class CacheResolutionException extends RuntimeException {
    public CacheResolutionException(String message, Throwable cause) {
        super(message, cause);
    }

    public CacheResolutionException(String message) {
        super(message);
    }
}

package dev.aws.proto.core.routing.distance;

import dev.aws.proto.core.routing.location.ILocation;

public interface IDistanceMatrixRow {
    /**
     * Distance from this row's location to the given location.
     *
     * @param location target location
     * @return distance in units of the implemented class
     */
    Distance distanceTo(ILocation location);
}

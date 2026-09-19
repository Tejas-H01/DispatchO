package dev.aws.proto.apps.nextday.domain.planning;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
public class VisitOrder {

    @Getter
    private String orderId;

    @Getter
    private String destinationId;

    @Getter
    private int sumWeight;
}

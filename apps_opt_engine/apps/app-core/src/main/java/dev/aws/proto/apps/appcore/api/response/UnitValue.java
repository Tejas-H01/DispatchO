package dev.aws.proto.apps.appcore.api.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UnitValue<TUnit, TValue> {
    private TUnit unit;
    private TValue value;
}

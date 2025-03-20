import SystemAttributesStd from "./stdV130/SystemAttributes.json";
import SystemAttributesOrigin from "./originV90/SystemAttributes.json";
import { AddAttribute } from "./attr";

export function AddSystemAttributes(attrs, version) {
    let SystemAttributes = {};
    if (version === "origin") {
        SystemAttributes = SystemAttributesOrigin;
    }
    else{
        SystemAttributes = SystemAttributesStd;
    }
    Object.entries(SystemAttributes).forEach(([attrSlot, attrValue]) => {
        AddAttribute(attrs, attrSlot, attrValue);
    });
}
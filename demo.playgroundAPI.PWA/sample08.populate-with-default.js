﻿function populateWithDefaultObject(value, defaultValue) {
    if (!defaultValue) return;
    if (!value) return;
    if (defaultValue instanceof Object && value instanceof Object) {
        for (let index in defaultValue)
            if (!(index in value))
                value[index] = defaultValue[index];
            else
                populateWithDefaultObject(value[index], defaultValue[index]);
    } else
        value = defaultValue;
} //populateWithDefaultObject

const a = {
    b: "B",
    c: {
        d: {
            e: "E",
            f: "F"
        },
        g: "G"
    }
}
console.log(a);
const b = { c: { d: { f: "F2" } } };
console.log(b);
populateWithDefaultObject(b, a);

console.log(b);

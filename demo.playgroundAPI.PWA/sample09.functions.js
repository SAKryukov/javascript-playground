﻿console.log("Functions of different kinds:")
function someFunction () {}
const someOtherFunction = () => { };
console.log(someFunction, someOtherFunction);
console.log("What are their constructors?");
console.log(someFunction.constructor, someOtherFunction.constructor);

console.log("What new Function() returns?");

const f = new Function();

console.log(f);

const result = f();

console.log("And anonymous has empty body, so it returns...", result);

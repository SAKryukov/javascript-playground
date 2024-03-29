﻿console.info("Recursion using arguments.callee");
writeLine();

function A(value) {
    if (value < 1) return;
    console.log(arguments[0]);
    arguments.callee(value - 1);
}
A(10);

writeLine();
console.log("Callee is not allowed in strict mode; set Strict Mode and click Ctrl+Enter too see");
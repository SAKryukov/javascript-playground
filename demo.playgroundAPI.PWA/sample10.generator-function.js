﻿console.info("Generators and Iterators");
writeLine();

function* generator() { 
  yield 1;
  yield 2;
  yield 3;
}

const iterator = generator();

console.log({"This is a generator function": generator});
console.log({"and iterator obtained as generator()": iterator});
writeLine();

for (value of iterator) write(value, ", ");
writeLine("...as many as values returned by yield");

writeLine();
console.info("Using iterator.return():");
writeLine();

const anotherIterator = generator();
for (value of anotherIterator) {
    if (value == 1) anotherIterator.return();
    write(value);
}
writeLine(" ...only first value was used before iterator was notified to return");

writeLine();
console.info("Using iterator.throw():");
writeLine();

function * exceptionHandlingGenerator() {
  try {
      yield 1;
      yield 2;
      yield 3;
  } catch (exception) {
      console.log("Exception caught");
      yield 4;
  }
}

const exceptionThrowingIterator = exceptionHandlingGenerator();
for (value of exceptionThrowingIterator) {
    if (value == 2) exceptionThrowingIterator.throw();
    writeLine(value);
}

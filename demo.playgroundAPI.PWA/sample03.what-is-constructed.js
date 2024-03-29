console.info("");
console.info("What a constructor constructs?");
console.info("");
console.log("");

function ConstructObject(object) {
   this.A = "A value";
   this.B = 113;
   if (object)
      return {A: "some other value", B: 12, C: [1, 2, 3, 13]};
}

const oneObject = ConstructObject("?");
const anotherObject = new ConstructObject();

console.log("One:", oneObject);
console.log("Two:", anotherObject);

console.log("");
console.info(`1) Remove a parameter from ConstructObject("?"), press Ctrl+Enter to run again`);
console.info("2) Set Strict mode and press Ctrl+Enter to run again");

   
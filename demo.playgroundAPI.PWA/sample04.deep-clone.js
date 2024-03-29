const deepClone = src => {
   if (!src) return src;
   if (!(src instanceof Object)) return src;
   const f = function() {};
   f.prototype = src;
   return new f();   
};

const inner = { toString:function() {return "clonable" }, a: 1, b: 3 }
const outer = { toString:function() {return "clonable" }, c:"outer", d: inner}
const clone = deepClone(outer);

console.log("Original:", outer, "Deep clone:", clone);

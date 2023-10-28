const naiveSolution = (A, B, C) => {
    if (A == 0)
        return -C/B;
    const p = B/A;
    const q = C/A;
    const determinant = (p / 2) * (p / 2) - q;
    if (determinant < 0) return [];
    const term = Math.sqrt(determinant);
    return [-p/2 - term, -p/2 + term];
};

class anyNumber extends Set {
    static get [Symbol.species]() { return Set; }
    get size() { return Number.POSITIVE_INFINITY; }
    add(object) {}
    has(element) {  return element != null && element.constructor == Number && !isNaN(element * 0); }
};

const solution = (A, B, C) => {
    if (A == 0 && B == 0 && C == 0)
        return new anyNumber;
    if (A == 0)
        return -C/B;
    const p = B/A;
    const q = C/A;
    const determinant = (p / 2) * (p / 2) - q;
    if (determinant < 0) return [];
    const sign = p > 0 ? -1 : 1;
    const mainRoot = -p/2 + sign * Math.sqrt(determinant);
    return [mainRoot, q / mainRoot]; // another root by Vieta's formula
};

"════════════════════════════ tests, demo: ════════════════════════════";

console.info("Solve the equation: Ax² + Bx + C = 0");
writeLine();

const formatEquation = (A, B, C) => {
    const signA = A >= 0 ? "" : "−";
    const signB = B >= 0 ? "+" : "−";
    const signC = C >=0 ? "+" : "−";
    return `${signA}${Math.abs(A)}x² ${signB} ${Math.abs(B)}x ${signC} ${Math.abs(C)} = 0`;
}

const show = (A, B, C) => {
    console.dir(`${formatEquation(A, B, C)}`);
    console.log(solution(A, B, C));
    writeLine();
}

show(5, 3, -2);
show(2, -8, 6);
show(3, -4, 2); // none
show(2, 4, 2); // equal roots
show(9, -6, 1); // equal roots

console.info("Reduced:");
writeLine();
show(3, 6, 0);
show(0, 2, -4);
show(0, 0, 32);
show(0, 0, -4);

console.info(formatEquation(0, 0, 0), "equation :");
writeLine();

const any = solution(0, 0, 0);
console.log(`solution(0, 0, 0): anyNumber = ${solution(0, 0, 0)}, size: ${solution(0, 0, 0).size}`);
console.log(`Any number has 1 = ${any.has(1)}`);
console.log(`Any number has Inf = ${any.has(Number.POSITIVE_INFINITY)}`);
console.log(`Any number has NaN = ${any.has(Number.NaN)}`);
console.log(`Any number has "abc" = ${any.has("abc")}`);
writeLine();

console.info("Better accuracy:");
writeLine();

const compare = (A, B, C, comment) => {
    console.dir(formatEquation(A, B, C));
    if (comment) console.log(`${comment}:`);
    const naiveLabel = "Naive", goodLabel = "Good";
    const naiveRoots = naiveSolution(A, B, C);
    const goodRoots = solution(A, B, C);
    console.log(`${naiveLabel} roots: ${naiveRoots}`);
    console.log(`${goodLabel} roots: ${goodRoots}`);
    const testTestability = roots => roots =! null && roots.constructor == Array && roots.length == 2;
    const testZeros = zeros => {
        let result = [];
        for (let zero of zeros)
            result.push(A * zero * zero + B * zero + C);
        return `zeros: ${result}`;
    };
    if (testTestability(naiveRoots) && testTestability(goodRoots)) {
        console.log(naiveLabel, testZeros(naiveRoots));
        console.log(goodLabel, testZeros(goodRoots));
    }
    writeLine();
}; //compare

compare(5, 3, - 2); // demonstrates better accuracy
compare(1 / 2, - 3, 1); // demonstrates better accuracy

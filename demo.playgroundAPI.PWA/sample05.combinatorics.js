﻿const word = "dermatoglyphics";
const permutationCount = 16;

writeLine();

function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function reverseWord(word) {
    let result = "";
    for (let index = word.length-1; index>=0; --index)
        result += word[index];
    return result;
} //reverseWord

function ramdomizeWord(word) {
    let result = "";
    const sample = word.split(result);
    const count = word.length;
    let sampleLength = count;
    for (let c = 0; c < count; ++c) {
        const last = sample[sampleLength - 1];
        const index = randomInt(0, sampleLength - 1);
        result += sample[index];
        sample[index] = last;
        sampleLength--;
    } //loop
    return result;
}
writeLine(word);
writeLine(reverseWord(word));
writeLine(String.fromCharCode(0x2500).repeat(word.length));
for (let c = 0; c < permutationCount; ++c) writeLine(ramdomizeWord(word));

String.prototype.shuffle = function () {
    const a = this.split("");
    const n = a.length;
    for(let i = n - 1; i > 0; --i) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
} //String.prototype.shuffle

return "Press Ctrl+Enter and keep it down :-)"

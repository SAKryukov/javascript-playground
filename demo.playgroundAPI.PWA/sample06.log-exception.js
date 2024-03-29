﻿console.log("Unfold all the object detail below to see the problem:");
console.log(``);

const sample = {
    level0_A: 1,
    level0_B: 2,
    level0_C: {
        level1_A: 10,
        level1_B: 20,
        level1_C: {
            level2_A: 100,
            level2_B: 200,
            level2_C: {
                level3_A: 1000,
                level3_B: 2000,
                level3_C: {
                    level4_A: 10000,
                    level4_B: 20000,
                    level4_C: {
                        level5_A: 100000,
                        level5_B: 200000,
                        level5_C: "the end"
                    }
                }
            }
        }
    }
}
Object.defineProperty(sample.level0_C.level1_C.level2_C, "problematic", {
    enumerable: true,
        get: function () {
            alert("Next line silently breaks unfolding of properties in console");
            throw { someProblem: 1 };
            return 1; // inaccessible
    } //get
});
console.log(sample);

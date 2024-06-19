"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.strToMs = void 0;
function strToMs(s) {
    let milli = 0;
    const values = [
        [1000, ['seconds', 's']],
        [60000, ['minutes', 'm']],
        [3600000, ['hours', 'h']],
        [86400000, ['days', 'd']],
        [604800000, ['weeks', 'w']],
    ];
    const strSearched = new Set(values.map(x => x[1]).flat());
    let searchValue = -1;
    while (s.length !== 0) {
        if (searchValue !== -1) {
            for (let i = 1; i <= s.length; i++) {
                const prefix = s.slice(0, i);
                if (strSearched.has(prefix)) {
                    milli += searchValue * values.find(x => x[1].includes(prefix))[0];
                    searchValue = -1;
                    s = s.slice(i);
                    break;
                }
            }
            if (searchValue === -1)
                s = s.slice(1);
        }
        else {
            const match = s.match(/^\d+/);
            if (match) {
                searchValue = parseInt(match[0], 10);
                s = s.slice(match[0].length);
            }
            else
                s = s.slice(1);
        }
    }
    return milli;
}
exports.strToMs = strToMs;

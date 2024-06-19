"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceEmbed = exports.replaceArray = void 0;
function replaceArray(s, search, replacer) {
    for (let i = 0; i < search.length; i++) {
        s = s.split(search[i]).join(replacer[i]);
    }
    return s;
}
exports.replaceArray = replaceArray;
function replaceEmbed(e, search, replace) {
    return JSON.parse(replaceArray(JSON.stringify(e), search, replace));
}
exports.replaceEmbed = replaceEmbed;

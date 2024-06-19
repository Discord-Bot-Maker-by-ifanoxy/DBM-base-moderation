"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const warns_1 = require("./src/tables/warns");
class Plugin {
    constructor(client) {
        this.client = client;
        this.loadTables();
    }
    loadTables() {
        return __awaiter(this, void 0, void 0, function* () {
            this.warns = (0, warns_1.loadWarnsTables)(this.client.database);
            yield this.client.database.sync();
        });
    }
}
exports.default = Plugin;

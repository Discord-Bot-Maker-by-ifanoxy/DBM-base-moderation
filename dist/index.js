"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const warns_1 = require("./src/tables/warns");
class Plugin {
    constructor(client) {
        this.client = client;
        this.loadTables();
    }
    loadTables() {
        this.warns = (0, warns_1.loadWarnsTables)(this.client.database);
    }
}
exports.default = Plugin;

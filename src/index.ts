import {DBMClient} from "../lib/structures/DBMClient";
import {loadWarnsTables, WarnsModel} from "./src/tables/warns";
import {ModelStatic} from "sequelize/types/model";

export default class Plugin {
    public client: DBMClient;
    public warns: ModelStatic<WarnsModel>;
    constructor(client: DBMClient) {
        this.client = client;
        this.loadTables();
    }

    loadTables() {
        this.warns = loadWarnsTables(this.client.database);
    }
}
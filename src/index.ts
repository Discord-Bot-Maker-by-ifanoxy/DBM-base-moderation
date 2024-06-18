import {DBMClient} from "../lib/structures/DBMClient";

export default class {
    public client: DBMClient;
    constructor(client: DBMClient) {
        this.client = client;
    }
}
import {Events} from "discord.js";
import {DBMClient} from "../../lib/structures/DBMClient";

export default {
    name: Events.ClientReady,
    execute(client: DBMClient)
    {
        client.logger.info("Client is connected.")
    }
}
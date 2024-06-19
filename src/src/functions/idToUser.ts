import {DBMClient} from "../../../lib/structures/DBMClient";

export async function idToUser(client: DBMClient, user_id)
{
    return client.users.cache.get(user_id) ?? await client.users.fetch(user_id);
}
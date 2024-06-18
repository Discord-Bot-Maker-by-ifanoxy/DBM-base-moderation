import {APIEmbed, ChatInputCommandInteraction, ComponentType, SlashCommandBuilder} from "discord.js";
import {DBMClient} from "../../lib/structures/DBMClient";
const embeds = require('../../embeds/commands/test-commands.json');
export default {
    customId: "test-components",
    type: ComponentType.Button,
    embeds: embeds as { [k in keyof typeof embeds]: APIEmbed},
    execute(client: DBMClient, interaction: ChatInputCommandInteraction)
    {
        return interaction.reply({
            embeds: [ this.embeds.test ]
        });
    }
}
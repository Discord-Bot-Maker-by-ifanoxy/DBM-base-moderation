import {
    ActionRowBuilder,
    APIEmbed,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    SlashCommandBuilder
} from "discord.js";
import {DBMClient} from "../../lib/structures/DBMClient";

const embeds = require('../../embeds/components/test-components.json');
export default {
    builder: new SlashCommandBuilder()
        .setName("test-command")
        .setDescription("This is a test slash command"),
    embeds: embeds as { [k in keyof typeof embeds]: APIEmbed},
    execute(client: DBMClient, interaction: ChatInputCommandInteraction)
    {
        return interaction.reply({
            embeds: [ this.embeds.test ],
            components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setCustomId("test-components")
                        .setStyle(ButtonStyle.Primary)
                        .setLabel("Test Component")
                )
            ]
        });
    }
}
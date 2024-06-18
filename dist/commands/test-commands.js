"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const embeds = require('../../embeds/components/test-components.json');
exports.default = {
    builder: new discord_js_1.SlashCommandBuilder()
        .setName("test-command")
        .setDescription("This is a test slash command"),
    embeds: embeds,
    execute(client, interaction) {
        return interaction.reply({
            embeds: [this.embeds.test],
            components: [
                new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                    .setCustomId("test-components")
                    .setStyle(discord_js_1.ButtonStyle.Primary)
                    .setLabel("Test Component"))
            ]
        });
    }
};

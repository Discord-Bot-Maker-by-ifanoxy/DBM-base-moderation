"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const embeds = require('../../embeds/commands/test-commands.json');
exports.default = {
    customId: "test-components",
    type: discord_js_1.ComponentType.Button,
    embeds: embeds,
    execute(client, interaction) {
        return interaction.reply({
            embeds: [this.embeds.test]
        });
    }
};

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
const discord_js_1 = require("discord.js");
const replacerArray_1 = require("../src/functions/replacerArray");
const embeds = require('../../embeds/commands/clear.json');
exports.default = {
    embeds: embeds,
    builder: new discord_js_1.SlashCommandBuilder()
        .setName('clear')
        .setDescription('clear message in channel')
        .setDMPermission(false)
        .setDefaultMemberPermissions(discord_js_1.PermissionsBitField.Flags.ManageMessages)
        .addNumberOption(opt => opt
        .setName('message-count')
        .setDescription('number of messages to delete')
        .setRequired(false)),
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const nb = interaction.options.getNumber('message-count');
            return interaction.channel.bulkDelete(nb)
                .then(() => {
                return interaction.reply({
                    embeds: [(0, replacerArray_1.replaceEmbed)(this.embeds.clear, ['{number}'], [nb])]
                });
            })
                .catch(() => {
                return interaction.reply({
                    embeds: [this.embeds.error]
                });
            });
        });
    }
};

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
const embeds = require('../../embeds/commands/deafen.json');
exports.default = {
    embeds: embeds,
    builder: new discord_js_1.SlashCommandBuilder()
        .setName('undeafen')
        .setDescription('undeafen guild member')
        .setDefaultMemberPermissions(discord_js_1.PermissionsBitField.Flags.DeafenMembers)
        .setDMPermission(false)
        .addUserOption(user => user
        .setName('member')
        .setDescription('member to undeafen')
        .setRequired(true)),
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const targetMember = yield interaction.guild.members.fetch(interaction.options.getUser('member'));
            if (!targetMember.voice.channel)
                return interaction.reply({
                    embeds: [this.embeds.not_in_voice]
                });
            if (!targetMember.voice.deaf)
                return interaction.reply({
                    embeds: [this.embeds.already_deaf]
                });
            yield targetMember.voice.setDeaf(false);
            return interaction.reply({
                embeds: [(0, replacerArray_1.replaceEmbed)(this.embeds.deafened, ['{member}'], [targetMember.toString()])]
            });
        });
    }
};

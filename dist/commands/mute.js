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
const hasBetterPermsThan_1 = require("../src/functions/hasBetterPermsThan");
const replacerArray_1 = require("../src/functions/replacerArray");
const strToMs_1 = require("../src/functions/strToMs");
const embeds = require('../../embeds/commands/mute.json');
exports.default = {
    embeds: embeds,
    builder: new discord_js_1.SlashCommandBuilder()
        .setName('mute')
        .setDescription('mute a guild member')
        .setDefaultMemberPermissions(discord_js_1.PermissionsBitField.Flags.DeafenMembers)
        .setDMPermission(false)
        .addUserOption(user => user
        .setName('member')
        .setDescription('member to mute')
        .setRequired(true))
        .addStringOption(opt => opt
        .setName('duration')
        .setDescription('duration of the mute')
        .setRequired(true)
        .setMaxLength(64))
        .addStringOption(opt => opt
        .setName('reason')
        .setDescription('the reason for the mute')
        .setRequired(false)
        .setMaxLength(512)),
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const targetMember = yield interaction.guild.members.fetch(interaction.options.getUser('member'));
            const modMember = yield interaction.guild.members.fetch(interaction.user.id);
            const duration = interaction.options.getString('duration');
            const reason = interaction.options.getString('reason');
            try {
                const convertTime = (0, strToMs_1.strToMs)(duration);
                if (convertTime === 0)
                    return interaction.reply({
                        embeds: [this.embeds.unresolved_time]
                    });
            }
            catch (_a) {
                return interaction.reply({
                    embeds: [this.embeds.unresolved_time]
                });
            }
            if (!(0, hasBetterPermsThan_1.hasBetterPermsThan)(modMember, targetMember))
                return interaction.reply({
                    embeds: [this.embeds.has_lower_perms]
                });
            const duration_ms = (0, strToMs_1.strToMs)(duration);
            return targetMember.timeout(duration_ms, reason)
                .then(() => {
                return interaction.reply({
                    embeds: [(0, replacerArray_1.replaceEmbed)(this.embeds.kicked, ['{member}', '{time}', '{reason}'], [targetMember.toString(), `<t:${Math.round((Date.now() + duration_ms) / 1000)}:R>`, reason !== null && reason !== void 0 ? reason : 'No reason provided'])]
                });
            })
                .catch(() => {
                return interaction.reply({
                    embeds: [this.embeds.cannot_mute]
                });
            });
        });
    }
};

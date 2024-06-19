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
const embeds = require('../../embeds/commands/softban.json');
exports.default = {
    embeds: embeds,
    builder: new discord_js_1.SlashCommandBuilder()
        .setName('softban')
        .setDescription('v a guild member')
        .setDefaultMemberPermissions(discord_js_1.PermissionsBitField.Flags.BanMembers)
        .setDMPermission(false)
        .addUserOption(user => user
        .setName('member')
        .setDescription('member to softban')
        .setRequired(true))
        .addStringOption(opt => opt
        .setName('reason')
        .setDescription('the reason for the softban')
        .setRequired(false)
        .setMaxLength(512)),
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const targetMember = yield interaction.guild.members.fetch(interaction.options.getUser('member'));
            const modMember = yield interaction.guild.members.fetch(interaction.user.id);
            const reason = interaction.options.getString('reason');
            if (!(0, hasBetterPermsThan_1.hasBetterPermsThan)(modMember, targetMember))
                return interaction.reply({
                    embeds: [this.embeds.has_lower_perms]
                });
            return targetMember.ban({ reason, deleteMessageSeconds: 14 * 24 * 60 * 60 })
                .then((m) => {
                return interaction.reply({
                    embeds: [(0, replacerArray_1.replaceEmbed)(this.embeds.banned, ['{member}', '{reason}'], [targetMember.toString(), reason !== null && reason !== void 0 ? reason : 'No reason provided'])]
                });
                interaction.guild.bans.remove(m.id);
            })
                .catch(() => {
                return interaction.reply({
                    embeds: [this.embeds.cannot_ban]
                });
            });
        });
    }
};
